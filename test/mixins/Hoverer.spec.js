import Hoverer from '@libs/Hoverer';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const message1 = {some: 'message'};
const message2 = {other: 'message'};

describe('Hoverer', function () {

    it('should instantiate', function () {
        new Hoverer(0); // no whammy
    });

    it('should set the message ~forever', function (done) {
        const hoverer = new Hoverer(0);
        const holder = {};
        hoverer.hover(holder, message1);
        equal(hoverer.message, message1);
        wait(10)
            .then(() => {
                equal(hoverer.message, message1);
            })
            .then(done, done);
    });

    it('should set and unset the message', function (done) {
        const hoverer = new Hoverer(0);
        const holder = {};
        hoverer.hover(holder, message1);
        equal(hoverer.message, message1);
        hoverer.unhover(holder);
        wait(10)
            .then(() => {
                equal(hoverer.message, null);
            })
            .then(done, done);
    });

    it('should set the message and unset the message after a wait', function (done) {
        this.slow(200);
        const hoverer = new Hoverer(50);
        const holder = {};
        hoverer.hover(holder, message1);
        equal(hoverer.message, message1);
        hoverer.unhover(holder);
        wait(10)
            .then(() => {
                equal(hoverer.message, message1);
            });
        wait(55)
            .then(() => {
                equal(hoverer.message, null);
            })
            .then(done, done);
    });

    it('should set and reset the message', function () {
        const hoverer = new Hoverer(0);
        const holder1 = {};
        const holder2 = {};
        hoverer.hover(holder1, message1);
        equal(hoverer.message, message1);
        hoverer.hover(holder2, message2);
        equal(hoverer.message, message2);
    });

    it('should set and reset the message, then not unset for the first holder', function (done) {
        const hoverer = new Hoverer(10);
        const holder1 = {};
        const holder2 = {};
        hoverer.hover(holder1, message1);
        equal(hoverer.message, message1);
        hoverer.hover(holder2, message2);
        equal(hoverer.message, message2);
        hoverer.unhover(holder1);
        wait(20)
            .then(() => {
                equal(hoverer.message, message2);
            })
            .then(done, done);
    });

    it('should set, then unset with a timeout, then reset, then not complete the unset', function (done) {
        const hoverer = new Hoverer(10);
        const holder1 = {};
        const holder2 = {};

        hoverer.hover(holder1, message1);
        equal(hoverer.message, message1);
        hoverer.unhover(holder1);

        hoverer.hover(holder2, message2);
        equal(hoverer.message, message2);

        wait(20)
            .then(() => {
                equal(hoverer.message, message2);
            })
            .then(done, done);
    });

    it('should set, then unset with a timeout, then reset with the same holder and stay set', function (done) {
        const hoverer = new Hoverer(10);
        const holder = {};

        hoverer.hover(holder, message1);
        equal(hoverer.message, message1);
        hoverer.unhover(holder);

        hoverer.hover(holder, message2);
        equal(hoverer.message, message2);

        wait(20)
            .then(() => {
                equal(hoverer.message, message2);
            })
            .then(done, done);
    });
});
