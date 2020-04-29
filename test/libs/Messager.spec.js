import Messager from '@libs/Messager';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const message1 = {some: 'message'};
const message2 = {other: 'message'};

describe('Messager', function () {

    it('should instantiate', function () {
        new Messager(0); // no whammy
    });

    it('should set the message', function () {
        const messager = new Messager(1000);
        equal(messager.message, null);
        messager.queue(message1);
        equal(messager.message, message1);
    });

    it('should set then timeout the message', function (done) {
        const messager = new Messager(10);
        messager.queue(message1);
        equal(messager.message, message1);
        wait(20)
            .then(() => {
                equal(messager.message, null);
            })
            .then(done, done);
    });

    it('should set one message, then another', function (done) {
        const messager = new Messager(10);
        messager.queue(message1);
        messager.queue(message2);
        equal(messager.message, message1);
        wait(15)
            .then(() => {
                equal(messager.message, message2);
            })
            .then(done, done);
    });

    it('should set a message, then clear it', function () {
        const messager = new Messager(10);
        messager.queue(message1);
        equal(messager.message, message1);
        messager.clear();
        equal(messager.message, null);
    });

    it('should set a message and return a Promise that resolves when done', function (done) {
        const messager = new Messager(10);
        messager.queue(message1)
            .then(done, done);
    });

    it('should set a message with a custom time', function (done) {
        const messager = new Messager(500);
        messager.queue(message1, 10);
        equal(message1, messager.message);
        wait(15)
            .then(() => {
                equal(messager.message, null);
            })
            .then(done, done);
    });
});
