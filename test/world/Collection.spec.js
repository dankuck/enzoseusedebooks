import Collection from '@world/Collection';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe.only('Collection', function () {

    it('should instantiate', function () {
        new Collection({}, []);
    });

    it('should have default elements', function () {
        const collection = new Collection({}, ['code1', 'code2'], {title: ''});
        equal({title: ''}, collection.code1);
        equal({title: ''}, collection.code2);
    });

    it('should not overwrite elements pre-constructor elements', function () {
        const original = {title: 'good guy'};
        const collection = new Collection({code1: original}, ['code1', 'code2'], {title: ''});
        equal(original, collection.code1);
        equal({title: ''}, collection.code2);
    });

    it('should load', function (done) {
        const data = [
            {title: 'name 1'},
        ];
        const axios = {
            get() { return Promise.resolve({data: [...data]}) },
        };
        const collection = new Collection({axios}, ['code1']);
        collection.load()
            .then(() => {
                equal(data[0], collection.code1);
            })
            .then(done, done);
    });

    it('should error if there are not enough items', function (done) {
        const data = [
            {title: 'name 1'},
        ];
        const axios = {
            get() { return Promise.resolve({data: [...data]}) },
        };
        const collection = new Collection({axios}, ['code1', 'code2']);
        collection.load()
            .then(
                () => {
                    assert(false, 'Did not error');
                },
                () => {
                    assert(true);
                }
            )
            .then(done, done);
    });

    it('should load more and not overwrite existing loaded things', function (done) {
        let count = 0;
        let code1;
        const axios = {
            get() {
                count++;
                return Promise.resolve({data: [{title: Math.random()}]});
            },
        };
        const collection = new Collection({axios}, ['code1', 'code2']);
        collection.load()
            .catch(() => {
                assert(collection.code1.title);
                code1 = collection.code1;
                // Ran out the first time, but we happen to know there are more
                // if we "hit the endpoint" again.
                return collection.load();
            })
            .then(() => {
                equal(2, count);
                assert(code1 === collection.code1, collection.pendingCodes);
                assert(collection.code1.title);
                assert(collection.code2.title);
            })
            .then(done, done);
    });

    it('should not reload if everything is loaded', function (done) {
        let count = 0;
        const axios = {
            get() {
                count++;
                return Promise.resolve({data: [{title: Math.random()}]});
            },
        };
        const collection = new Collection({axios}, ['code1']);
        collection.load()
            .then(() => {
                return collection.load();
            })
            .then(() => {
                equal(1, count);
            })
            .then(done, done);
    });

    it('should not load again while loading', function (done) {
        let count = 0;
        const data = [
            {title: 'a name'},
        ];
        const axios = {
            get() {
                count++;
                return Promise.resolve({data: [...data]});
            },
        };
        const collection = new Collection({axios}, ['code1']);
        Promise.all([
            collection.load(),
            collection.load(),
        ])
            .then(() => {
                equal(1, count);
            })
            .then(done, done);
    });

    it('should not load the same item under two codes in separate loads', function (done) {
        const data = [
            {title: 'a name'},
        ];
        const axios = {
            get() {
                return Promise.resolve({data: [...data]});
            },
        };
        const code1 = {title: 'a name'};
        const collection = new Collection({axios, code1}, ['code2']);
        collection.load()
            .then(
                () => {
                    assert(false, 'Should have thrown an error because the only item is already used');
                },
                () => {
                    assert(true);
                }
            )
            .then(done, done);
    });
});
