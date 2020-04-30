import Reviver from '@libs/Reviver';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

class Test1 {}

describe('Reviver', function () {

    it('instantiates', function () {
        new Reviver(); // no whammy
    });

    it('replaces nothing by default', function () {
        const reviver = new Reviver();
        const test = new Test1();
        const replaced = reviver.replace('test', test);
        assert(test === replaced);
    });

    it('revives no-changes by default', function () {
        const reviver = new Reviver();
        const test = {some: 'thing'};
        const revived = reviver.revive('test', test);
        assert(test === revived);
    });

    it('revives null for unmatched __class__', function () {
        const reviver = new Reviver();
        const test = {__class__: 'Test1', __data__: '{}'};
        const revived = reviver.revive('test', test);
        assert(null === revived);
    });

    it('replaces according to added class', function () {
        const reviver = new Reviver();
        reviver.add(
            'TestX',
            Test1,
            null,
            (key, data) => {
                assert(data === test);
                return 'replaced data';
            }
        );
        const test = new Test1();
        const replaced = reviver.replace('test', test);
        equal({__class__: 'TestX', __data__: 'replaced data'}, replaced);
    });

    it('replaces according to first added class if two matches are added', function () {
        const reviver = new Reviver();
        reviver.add(
            'TestX',
            Test1,
            null,
            (key, data) => {
                assert(data === test);
                return 'replaced data';
            }
        );
        reviver.add(
            'SOMETHING_ELSE',
            Test1,
            null,
            (key, data) => {
                assert(data === test);
                return 'replaced data';
            }
        );
        const test = new Test1();
        const replaced = reviver.replace('test', test);
        equal({__class__: 'TestX', __data__: 'replaced data'}, replaced);
    });

    it('revives according to added class', function () {
        const reviver = new Reviver();
        reviver.add(
            'DateX',
            Date,
            (key, data) => {
                assert(data === '1985-10-26');
                return 'revived data';
            },
            null
        );
        const date = {__class__: 'DateX', __data__: '1985-10-26'};
        const revived = reviver.revive('date', date);
        equal('revived data', revived);
    });

    it('revives according to first added name when there are two names', function () {
        const reviver = new Reviver();
        reviver.add(
            'DateX',
            Date,
            (key, data) => {
                assert(data === '1985-10-26');
                return 'revived data';
            },
            null
        );
        reviver.add(
            'SOMETHING_ELSE',
            Date,
            (key, data) => {
                assert(data === '1985-10-26');
                return 'revived data';
            },
            null
        );
        const date = {__class__: 'DateX', __data__: '1985-10-26'};
        const revived = reviver.revive('date', date);
        equal('revived data', revived);
    });

    it('registers a class', function () {
        const reviver = new Reviver();
        let caughtReviver;
        reviver.register({
            registerReviver(reviver) {
                caughtReviver = reviver;
            },
        });
        assert(reviver === caughtReviver);
    });

    it('does not let toJSON run before it', function () {
        let calledToJSON = false;
        // If a class has toJSON (e.g., the Date class), the toJSON gets called
        // before the replacer() function. That can prevent us from recognizing
        // the data as an instance of that class.
        // We remove the toJSON before running replace, and use it ourselves
        // when the time is right.
        class X {
            toJSON() {
                calledToJSON = true;
                return 'i am json';
            }
        };
        const reviver = new Reviver();
        reviver.add(
            'X',
            X,
            (k, v) => v,
            (k, v) => v,
        );
        reviver.beforeReplace();
        const json = JSON.stringify(new X(), reviver.replace);
        reviver.afterReplace();
        assert(calledToJSON);
        equal({__class__: 'X', __data__: 'i am json'}, JSON.parse(json));
    });

    it('works with classes that de-circularize themselves', function () {
        class X {}
        class Y {}
        const x = new X();
        const y = new Y();
        x.y = y;
        y.x = x;
        const reviver = new Reviver();
        reviver.add(
            'Y',
            Y,
            (k, v) => new Y(),
            (k, v) => ({...v})
        );
        reviver.add(
            'X',
            X,
            (k, v) => new X(),
            (k, v) => ({...v, y: null})
        );
        JSON.stringify(y, reviver.replace);
        // no whammy
    });

    it('does not re-re-...-replace if a replacer returns the same value', function () {
        class X {}
        const reviver = new Reviver();
        reviver.add(
            'X',
            X,
            (k, v) => new X(),
            (k, v) => v
        );
        JSON.stringify(new X(), reviver.replace);
        // no infinite recursion
    });

    describe('JS built-in types', function () {
        /**
         * Reviver should handle some JS built-in types out of the box
         */

        const reviver = new Reviver();

        it('should save a Date correctly', function () {
            const date = new Date('Jan 16, 2020');
            const expect = '{"__class__":"Date","__data__":"2020-01-16T05:00:00.000Z"}';

            reviver.beforeReplace();
            equal(expect, JSON.stringify(date, reviver.replace));
            reviver.afterReplace();
        });

        it('should load a Date correctly', function () {
            const date = '{"__class__":"Date","__data__":"2020-01-16T05:00:00.000Z"}';
            const expect = new Date('Jan 16, 2020');

            equal(expect, JSON.parse(date, reviver.revive));
        });

        it('should save a Map correctly', function () {
            const map = new Map();
            map.set(['some', 'key', 'object'], "string value");
            const expect = '{"__class__":"Map","__data__":[[["some","key","object"],"string value"]]}';

            reviver.beforeReplace();
            equal(expect, JSON.stringify(map, reviver.replace));
            reviver.afterReplace();
        });

        it('should load a Map correctly', function () {
            const json = '{"__class__":"Map","__data__":[[["some","key","object"],"string value"]]}';
            const expect = new Map();
            expect.set(['some', 'key', 'object'], "string value");
            const unexpect = new Map();
            unexpect.set(['not the right array'], "even though this is a string");

            const copy = JSON.parse(json, reviver.revive);

            // We need to convert the maps to arrays before testing. It turns out
            // equal doesn't work right on Maps.
            equal(Array.from(expect), Array.from(copy));
            notEqual(Array.from(unexpect), Array.from(copy));
        });
    });
});
