import assert from 'assert';
import SerialStorage from '@libs/SerialStorage.js';
const {deepStrictEqual: equal} = assert;

describe('SerialStorage', function () {

    it('should instantiate', function () {
        new SerialStorage({});
    });

    it('should read stored data', function () {
        const myData = {some: 'data'};
        const myJsonData = JSON.stringify(myData);
        const storage = new SerialStorage({myData: myJsonData});
        const redData = storage.read('myData');
        equal(redData, myData);
    });

    it('should store data', function () {
        const myData = {some: 'data'};
        const myJsonData = JSON.stringify(myData);
        const internal = {};
        const storage = new SerialStorage(internal);
        storage.write('myData', myData);
        equal(myJsonData, internal.myData);
    });

    it('should read all stored data', function () {
        const internal = {
            object: JSON.stringify({a: 'thing'}),
            string: JSON.stringify('and another thing'),
            array : JSON.stringify(['and', 'this', 'too']),
        };
        const normal = {
            object: {a: 'thing'},
            string: 'and another thing',
            array : ['and', 'this', 'too'],
        };
        const storage = new SerialStorage(internal);
        const redData = storage.read();
        equal(redData, normal);
    });

    it('should write all data', function () {
        const internal = {};
        const expected = {
            object: JSON.stringify({a: 'thing'}),
            string: JSON.stringify('and another thing'),
            array : JSON.stringify(['and', 'this', 'too']),
        };
        const normal = {
            object: {a: 'thing'},
            string: 'and another thing',
            array : ['and', 'this', 'too'],
        };
        const storage = new SerialStorage(internal);
        storage.write(normal);
        equal(expected, internal);
    });

    it('should recover from read errors', function () {
        const storage = new SerialStorage(
            {
                length: 'not JSON',
            },
            (method, error, key, data) => { return 'errored'; }
        );
        const red = storage.read('length');
        equal('errored', red);
    });

    it('should recover from write errors', function () {
        const storage = new SerialStorage(
            {},
            (method, error, key, data) => { return 'errored'; }
        );
        const red = storage.write('length', Symbol('x'));
        equal('errored', red);
    });
});
