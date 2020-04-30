import Scheduler from '@libs/Scheduler';
import Reviver from '@libs/Reviver';
import assert from 'assert';
import wait from '@libs/wait';
import intercept from '../fixtures/intercept';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const loadJSON = function (reviver, json) {
    return JSON.parse(json, (k, v) => reviver.revive(k, v));
};
const saveJSON = function (reviver, object) {
    reviver.beforeReplace();
    const json = JSON.stringify(object, (k, v) => reviver.replace(k, v));
    reviver.afterReplace();
    return json;
};

describe.only('Scheduler', function () {

    describe('new, load, save', function () {

        it('instantiates', function () {
            new Scheduler(); // no whammy
        });

        it('saves to JSON', function () {
            const scheduler = new Scheduler();
            const reviver = new Reviver();
            reviver.register(Scheduler);
            const json = saveJSON(reviver, scheduler);
            const pojo = JSON.parse(json);
            equal('Scheduler', pojo.__class__);
        });

        it('loads from JSON', function () {
            const scheduler = new Scheduler();
            const reviver = new Reviver();
            reviver.register(Scheduler);
            const copy = loadJSON(reviver, saveJSON(reviver, scheduler));
            assert(copy instanceof Scheduler);
        });

        it('saves without target', function () {
            const scheduler = new Scheduler();
            // Let's throw a recursive wrench into the works
            scheduler.setTarget(scheduler);
            const reviver = new Reviver();
            reviver.register(Scheduler);
            const copy = loadJSON(reviver, saveJSON(reviver, scheduler));
            assert(copy instanceof Scheduler);
        });
    });

    describe('scheduling', function () {

        it('schedules with a ms integer', function (done) {
            let ran = false;
            const scheduler = new Scheduler();
            scheduler.setTarget({run(){ran = true}});
            scheduler.schedule(5, 'run');
            assert(!ran);
            wait(10)
                .then(() => assert(ran))
                .then(done, done);
        });

        it('runs immediately after the target is set', function (done) {
            let ran = false;
            const scheduler = new Scheduler();
            scheduler.schedule(5, 'run');
            wait(10)
                .then(() => assert(!ran))
                .then(() => scheduler.setTarget({run(){ran = true}}))
                .then(() => wait(0))
                .then(() => assert(ran))
                .then(done, done);
        });

        it('runs after a while once the target is set', function (done) {
            let ran = false;
            const scheduler = new Scheduler();
            scheduler.schedule(5, 'run');
            scheduler.setTarget({run(){ran = true}});
            wait(0)
                .then(() => assert(!ran))
                .then(() => wait(10))
                .then(() => assert(ran))
                .then(done, done);
        });

        it('runs after copying', function (done) {
            let ran = false;
            const scheduler = new Scheduler();
            scheduler.schedule(5, 'run');
            scheduler.setTarget({run(){}});
            const reviver = new Reviver();
            reviver.register(Scheduler);
            const copy = loadJSON(reviver, saveJSON(reviver, scheduler));
            copy.setTarget({run(){ran = true}});
            wait(0)
                .then(() => assert(!ran))
                .then(() => wait(10))
                .then(() => assert(ran))
                .then(done, done);
        });

        it('does not double-run after copying', function (done) {
            let ran = 0;
            const scheduler = new Scheduler();
            scheduler.schedule(5, 'run');
            scheduler.setTarget({run(){ran++}});
            const reviver = new Reviver();
            reviver.register(Scheduler);
            wait(10)
                .then(() => equal(1, ran))
                .then(() => {
                    const copy = loadJSON(reviver, saveJSON(reviver, scheduler));
                    copy.setTarget({run(){ran++}});
                })
                .then(() => wait(10))
                .then(() => equal(1, ran, 'Oh no, it ran again!'))
                .then(done, done);
        });

        it('does not try again after failure', function (done) {
            intercept(console, 'error', function (done) {
                let ran = 0;
                const scheduler = new Scheduler();
                scheduler.setTarget({
                    run(){
                        ran++;
                        throw new Error();
                    },
                    noop() {}
                });
                scheduler.schedule(5, 'run');
                wait(10)
                    .then(() => equal(1, ran))
                    .then(() => scheduler.schedule(5, 'noop'))
                    .then(() => wait(10))
                    .then(() => equal(1, ran, 'If this is 2, then the scheduled task did not get removed earlier'))
                    .then(done, done);
            })
                .then(calls => {
                    equal(1, calls.length)
                    equal('Scheduler error:', calls[0].args[0]);
                })
                .then(done, done);
        });
    });
});
