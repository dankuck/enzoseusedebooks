import reviver from '@app/reviver';
import assert from 'assert';
import wait from '@libs/wait';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

describe.only('reviver (instance)', function () {

    it('should save a Date correctly', function () {
        const date = new Date('Jan 16, 2020');
        const expect = '{"__class__":"Date","__data__":"2020-01-16T05:00:00.000Z"}';

        reviver.beforeReplace();
        equal(expect, JSON.stringify(date, (...args) => reviver.replace(...args)));
        reviver.afterReplace();
    });

    it('should load a Date correctly', function () {
        const date = '{"__class__":"Date","__data__":"2020-01-16T05:00:00.000Z"}';
        const expect = new Date('Jan 16, 2020');

        equal(expect, JSON.parse(date, (...args) => reviver.revive(...args)));
    });

    it('should save a Map correctly', function () {
        const map = new Map();
        map.set(['some', 'key', 'object'], "string value");
        const expect = '{"__class__":"Map","__data__":[[["some","key","object"],"string value"]]}';

        reviver.beforeReplace();
        equal(expect, JSON.stringify(map, (...args) => reviver.replace(...args)));
        reviver.afterReplace();
    });

    it('should load a Map correctly', function () {
        const json = '{"__class__":"Map","__data__":[[["some","key","object"],"string value"]]}';
        const expect = new Map();
        expect.set(['some', 'key', 'object'], "string value");
        const unexpect = new Map();
        unexpect.set(['not the right array'], "even though this is a string");

        const copy = JSON.parse(json, (...args) => reviver.revive(...args));

        // We need to convert the maps to arrays before testing. It turns out
        // equal doesn't work right on Maps.
        equal(Array.from(expect), Array.from(copy));
        notEqual(Array.from(unexpect), Array.from(copy));
    });
});
