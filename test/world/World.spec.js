import World from '@world/World';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('World', function () {

    it('should instantiate', function () {
        new World({});
    });

    it('should have a version', function () {
        assert(new World({}).version);
    });

    it('should not update a high version', function () {
        const world = new World({version: Infinity});
        equal(['axios', 'version'], Object.keys(world).sort());
    });

    it('should choose a name from a collection of 1', function (done) {
        let caughtUrl;
        const axios = {
            get(url) {
                caughtUrl = url;
                return Promise.resolve({data: ['a name']});
            },
        };
        const world = new World({axios});
        world.chooseNameFromCollection('code-1', 'bargain')
            .then(name => {
                equal('a name', name);
                assert(/bargain-names/.test(caughtUrl), `caughtUrl: ${caughtUrl}`);
            })
            .then(done, done);
    });

    it('should only load the collection once', function (done) {
        let getCount = 0;
        const axios = {
            get() {
                getCount++;
                return Promise.resolve({data: ['a name']});
            },
        };
        const world = new World({axios});
        world.chooseNameFromCollection('code-1', 'bargain')
            .then(name => {
                equal('a name', name);
                return world.chooseNameFromCollection('code-1', 'bargain');
            })
            .then(name => {
                equal('a name', name);
                equal(1, getCount);
            })
            .then(done, done);
    });

    it('should get the same name twice', function (done) {
        const names = [
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
        ];
        const axios = {
            get() {
                return Promise.resolve({data: names});
            },
        };
        let firstName;
        const world = new World({axios});
        world.chooseNameFromCollection('code-1', 'bargain')
            .then(name => {
                firstName = name;
                return world.chooseNameFromCollection('code-1', 'bargain');
            })
            .then(name => {
                equal(firstName, name);
            })
            .then(done, done);
    });

    it('should get different names', function (done) {
        const names = [
            Math.random(),
            Math.random(),
        ];
        const axios = {
            get() {
                return Promise.resolve({data: names});
            },
        };
        let firstName;
        const world = new World({axios});
        world.chooseNameFromCollection('code-1', 'bargain')
            .then(name => {
                firstName = name;
                return world.chooseNameFromCollection('code-2', 'bargain');
            })
            .then(name => {
                notEqual(firstName, name);
            })
            .then(done, done);
    });

    it('should run out of names', function (done) {
        const names = [
            Math.random(),
        ];
        const axios = {
            get() {
                return Promise.resolve({data: names});
            },
        };
        const world = new World({axios});
        world.chooseNameFromCollection('code-1', 'bargain')
            .then(name => {
                return world.chooseNameFromCollection('code-2', 'bargain');
            })
            .then(
                () => assert(false, 'Expected an error'),
                () => assert(true) // we are all out of names
            )
            .then(done, done);
    });

    it('should not double-get a name under race conditions', function (done) {
        const names = [
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
        ];
        // Make sure that each call takes 10 ms so the next one starts before
        // the first one is finished. This will cause two calls to try to set
        // the internal `names` property. If they both succeed, they could
        // overwrite each other and give different results for the same name
        const axios = {
            get() {
                return delay(10).then(() => { return {data: names} });
            },
        };
        const world = new World({axios});
        Promise
            .all([
                world.chooseNameFromCollection('code-1', 'bargain'),
                world.chooseNameFromCollection('code-1', 'bargain'),
            ])
            .then(names => {
                equal(...names);
            })
            .then(done, done);
    });

    it('should not double-load names under race conditions', function (done) {
        const names = [
            Math.random(),
        ];
        // Make sure that each call takes 10 ms so the next one starts before
        // the first one is finished. This will cause two calls to try to set
        // the internal `names` property. If they both succeed, they could
        // overwrite `names` and cause two different codes to use the same name
        const axios = {
            get() {
                return delay(10).then(() => { return {data: [...names]} });
            },
        };
        const world = new World({axios});
        Promise
            .all([
                world.chooseNameFromCollection('code-1', 'bargain'),
                world.chooseNameFromCollection('code-2', 'bargain'),
            ])
            .then(
                names => {
                    assert(false, `Expected an error on the second name: ${names}`);
                },
                error => {
                    assert(true);
                }
            )
            .then(done, done);
    });
});
