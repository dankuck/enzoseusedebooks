import World from '@world/World';
import Collection from '@world/Collection';
import assert from 'assert';
import version_3_save from '../fixtures/version_3_save.json';
import version_4_save from '../fixtures/version_4_save.json';
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
        equal(['version'], Object.keys(world).sort());
    });

    const all_version_tests = function (worldObject) {

        it('should have a lobbyPlant', function () {
            const world = new World(worldObject);
            assert(world.lobbyPlant);
            assert(!world.plant); // this old name was deleted
            equal(
                ['animation', 'name', 'response', 'ruffled'].sort(),
                Object.keys(world.lobbyPlant).sort()
            );
        });

        it('should be in the lobby', function () {
            const world = new World(worldObject);
            equal('lobby', world.location);
        });

        it('should have bargain books', function () {
            const world = new World(worldObject);
            assert(world.collections);
            assert(world.collections.bargain instanceof Collection);
            assert(world.collections.bargain.book1);
            assert(world.collections.bargain.book2);
            assert(world.collections.bargain.book3);
            assert(world.collections.bargain.book4);
            assert(world.collections.bargain.book5);
            assert(world.collections.bargain.book6);
            assert(world.collections.bargain.book7);
            assert(world.collections.bargain.book8);
            assert(world.collections.bargain.book9);
            assert(world.collections.bargain.book10);
            assert(world.collections.bargain.book11);
            assert(world.collections.bargain.book12);
        });

        it('should be able to ruffle the plant', function () {
            const world = new World(worldObject);
            world.ruffleLobbyPlant();
            assert(world.lobbyPlant.name, 'Ruffled Plant');
            assert(world.lobbyPlant.response, "Hasn't this plant been through enough?");
            assert(world.lobbyPlant.ruffled, true);
        });
    };

    describe('Fresh version', function () {
        all_version_tests({});
    });

    describe('Version 3 - ruffled plant', function () {
        all_version_tests(version_3_save);
    });

    describe('Version 4 - ruffled plant, loaded books', function () {
        all_version_tests(version_4_save);
    });
});
