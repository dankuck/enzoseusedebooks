import CallbackRing from '@libs/CallbackRing';
import assert from 'assert';
import wait from '@libs/wait';
const {deepStrictEqual: equal} = assert;

describe('CallbackRing', function () {

    it('should instantiate', function () {
        new CallbackRing(0); // no whammy
    });

    it('should start with nothing', function () {
        new CallbackRing(0).start(); // no whammy
    });

    it('should add and run', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        ring.add(() => ran = true);
        ring.start();
        wait(10)
            .then(() => assert(ran))
            .then(done, done);
    });

    it('should add and run several times', function (done) {
        const ring = new CallbackRing(10);
        let ran = 0;
        ring.add(() => ran++);
        ring.start();
        wait(35)
            .then(() => assert(ran >= 3))
            .then(done, done);
    });

    it('should add two and run them in succession', function (done) {
        const ring = new CallbackRing(0);
        let ran = [];
        ring.add(() => ran.push('1st'));
        ring.add(() => ran.push('2nd'));
        ring.start();
        wait(10)
            .then(() => {
                const expect = [
                    '1st',
                    '2nd',
                    '1st',
                    '2nd',
                    '1st',
                    '2nd',
                ];
                equal(expect, ran.slice(0, 6))
            })
            .then(done, done);
    });

    it('should add and not run', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        ring.add(() => ran = true);
        wait(10)
            .then(() => assert(!ran))
            .then(done, done);
    });

    it('should add and remove', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        const cb = () => ran = true;
        ring.add(cb);
        ring.remove(cb);
        ring.start();
        wait(10)
            .then(() => assert(!ran))
            .then(done, done);
    });

    it('should add and run and stop', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        ring.add(() => ran = true);
        ring.start();
        wait(10)
            .then(() => {
                assert(ran);
                ring.stop();
                ran = false;
                return wait(10);
            })
            .then(() => {
                assert(!ran);
            })
            .then(done, done);
    });

    it('should recover and continue on error', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        let reportedError = null;
        const consoleError = console.error;
        console.error = err => reportedError = err;
        ring.add(() => { throw '1st one errors' });
        ring.add(() => ran = true);
        ring.start();
        wait(10)
            .then(() => {
                ring.stop();
                assert(ran);
                equal('1st one errors', reportedError);
            })
            .then(done, done)
            .finally(() => {
                console.error = consoleError;
            });
    });

    it('should run once by stopping itself', function (done) {
        const ring = new CallbackRing(0);
        let ran = 0;
        ring.add(() => ran++);
        ring.add(() => ring.stop());
        ring.start();
        wait(10)
            .then(() => equal(ran, 1))
            .then(done, done);
    });

    it('should not add the same callback twice', function (done) {
        // We check that it did not add the same callback twice by attempting
        // to add the same callback twice and adding a stop-callback after
        // that. If it does add the same callback twice, they will both run
        // before the stop-callback.
        const ring = new CallbackRing(0);
        let ran = 0;
        const cb = () => ran++;
        // expect to run once
        ring.add(cb);
        // then expect to not actually add this time
        ring.add(cb);
        // then expect to stop, having run just once
        ring.add(() => ring.stop());
        ring.start();
        wait(10)
            .then(() => equal(ran, 1))
            .then(done, done);
    });

    it('should move a callback to the end', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        const cb = () => true;
        ring.add(cb);
        ring.add(() => ring.stop());
        ring.add(cb);
        ring.start();
        wait(10)
            .then(() => assert(!ran))
            .then(done, done);
    });

    it('should start where it stopped', function (done) {
        const ring = new CallbackRing(0);
        let ran = false;
        ring.add(() => ring.stop());
        ring.add(() => ran++);
        ring.start();
        wait(10)
            .then(() => {
                assert(!ran);
                // If it starts where it stopped, then it will start on the cb
                // that sets the `ran` variable
                ring.start();
                return wait(10);
            })
            .then(() => assert(ran))
            .then(done, done);
    });

    it('should run the first cb immediately and the next one after the interval', function (done) {
        const ring = new CallbackRing(20);
        let ran1 = false;
        let ran2 = false;
        ring.add(() => ran1 = true);
        ring.add(() => ran2 = true);
        ring.start();
        wait(10)
            .then(() => {
                assert(ran1);
                assert(!ran2);
                return wait(15);
            })
            .then(() => assert(ran2))
            .then(done, done);
    });
});
