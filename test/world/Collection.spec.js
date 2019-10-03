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

    it('should not overwrite elements', function () {
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

    it('should not overwrite existing loaded things');

    it('should not reload if everything is loaded');

    it('should not race-load');

    it('should error if there are not enough items');

    it('should load more');

    it('should not load the same item under two codes in separate loads');
});
