import assert from 'assert';
import JsonStorage from '@libs/JsonStorage.js';
const {deepStrictEqual: equal} = assert;

describe('JsonStorage', function () {

    it('should instantiate', function () {
        new JsonStorage({}, 'myRoot');
    });

    it('should read stored data', function () {
        const myJsonData = JSON.stringify({some: 'data'});
        const storage = new JsonStorage({myRoot: myJsonData}, 'myRoot');
        const some = storage.read('some');
        equal('data', some);
    });

    it('should store data', function () {
        const myData = {some: 'data'};
        const internal = {};
        const storage = new JsonStorage(internal, 'myRoot');
        storage.write('myData', myData);
        const expected = JSON.stringify({'myData': myData});
        equal(expected, internal.myRoot);
    });

    it('should read all stored data', function () {
        const storage = new JsonStorage({}, 'myRoot');
        storage.write('some', 'data');
        storage.write('some-more', 'data-too');
        const everything = storage.read();
        equal(
            {
                'some': 'data',
                'some-more': 'data-too',
            },
            everything
        );
    });

    it('should write all data', function () {
        const storage = new JsonStorage({}, 'myRoot');
        storage.write({
            'this': {'one': 'thing'},
            'and this': 'too',
        });
        equal({'one': 'thing'}, storage.read('this'));
        equal('too', storage.read('and this'));
    });

    it('should revive', function () {
        const caughtParams = {};
        const storage = new JsonStorage(
            {},
            'myRoot',
            {
                reviver(key, value) {
                    if (key === 'x') {
                        caughtParams[key] = value;
                        return 'transformed';
                    } else {
                        return value;
                    }
                },
            }
        );
        storage.write('x', 123);
        const x = storage.read('x');
        equal(123, caughtParams.x);
        equal('transformed', x);
    });

    it('should replace', function () {
        const caughtParams = {};
        const storage = new JsonStorage(
            {},
            'myRoot',
            {
                replacer(key, value) {
                    if (key === 'x') {
                        caughtParams[key] = value;
                        return 'transformed';
                    } else {
                        return value;
                    }
                },
            }
        );
        storage.write('x', 123);
        const x = storage.read('x');
        equal(123, caughtParams.x);
        equal('transformed', x);
    });

    it('should write with one and read with another', function () {
        const internal = {};
        const storage1 = new JsonStorage(internal, 'myRoot');
        const storage2 = new JsonStorage(internal, 'myRoot');
        storage1.write('x', 123);
        const x = storage2.read('x');
        equal(123, x);
    });

    it('should delete a key', function () {
        const storage = new JsonStorage({}, 'myRoot');
        storage.write('x', 123);
        equal(123, storage.read('x'));
        storage.delete('x');
        assert(!storage.read('x'));
    });

    it('should delete all', function () {
        const storage = new JsonStorage({}, 'myRoot');
        storage.write('x', 123);
        equal(1, Object.keys(storage.read()).length);
        storage.delete();
        equal(0, Object.keys(storage.read()).length);
    });
});
