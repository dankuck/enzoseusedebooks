import World from '@world/World';
import Collection from '@world/Collection';
import Reviver from '@libs/Reviver';
import assert from 'assert';
import version_3_save from '../fixtures/version_3_save.json';
import version_4_save from '../fixtures/version_4_save.json';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reviver = new Reviver();
reviver.register(World);

const buildBuilder = function (plain_object) {
    const json = JSON.stringify(plain_object);
    return function () {
        return JSON
            .parse(json, (k, v) => reviver.revive(k, v))
            .world;
    };
};

const build_version_3_world = buildBuilder(version_3_save);
const build_version_4_world = buildBuilder(version_4_save);

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

    const all_version_tests = function (builder) {

        it('should have a lobbyPlant', function () {
            const world = builder();
            assert(world.lobbyPlant);
            assert(!world.plant); // this old name was deleted
            const keys = Object.keys(world.lobbyPlant).sort();
            assert(keys.includes('animation'));
            assert(keys.includes('name'));
            assert(keys.includes('ruffled'));
        });

        it('should be in the lobby', function () {
            const world = builder();
            equal('lobby', world.location);
        });

        it('should have bargain books', function () {
            const world = builder();
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

        it('should have fiction books', function () {
            const world = builder();
            assert(world.collections);
            assert(world.collections.fiction instanceof Collection);
            for (let i = 0; i < 150; i++) {
                assert(world.collections.fiction['book' + i]);
            }
        });

        it('should have nonfiction books', function () {
            const world = builder();
            assert(world.collections);
            assert(world.collections.nonfiction instanceof Collection);
            for (let i = 0; i < 150; i++) {
                assert(world.collections.nonfiction['book' + i]);
            }
        });

        it('should be able to ruffle the plant', function () {
            const world = builder();
            const msgs = [];
            if (!world.lobbyPlant.ruffled) {
                world.ruffleLobbyPlant(msg => msgs.push(msg));
                assert(world.lobbyPlant.name, 'Ruffled Plant');
                assert(msgs.includes("You ruffled the plant. It's messy now."));
                assert(world.lobbyPlant.ruffled, true);
            }
            world.ruffleLobbyPlant(msg => msgs.push(msg));
            assert(world.lobbyPlant.name, 'Ruffled Plant');
            assert(msgs.includes("Hasn't this plant been through enough?"));
            assert(world.lobbyPlant.ruffled, true);
        });

        it('should visit another place', function () {
            const world = builder();
            const place = Math.random();
            assert(world.locationHistory.length === 1);
            world.goTo(place);
            assert(world.location === place);
            assert(world.locationHistory.length === 2);
        });

        it('should not go nowhere', function () {
            const world = builder();
            assert(world.locationHistory.length === 1);
            let caughtError;
            try {
                world.goTo();
            } catch (e) {
                caughtError = e;
            }
            assert(caughtError);
            assert(world.location);
            assert(world.locationHistory.length === 1);
        });

        it('should know where it has been', function () {
            const world = builder();
            const place1 = Math.random();
            const place2 = Math.random();
            const place3 = Math.random();
            world.goTo(place1);
            world.goTo(place2);
            assert(world.hasGoneTo(place1));
            assert(world.hasGoneTo(place2));
            assert(!world.hasGoneTo(place3));
        });

        it('should have a battery', function () {
            const world = builder();
            assert(world.battery);
        });

        it('should have an inventory', function () {
            const world = builder();
            assert(world.inventory instanceof Array);
        });
    };

    describe('Fresh version', function () {
        all_version_tests(() => new World({}));
    });

    describe('Version 3 - ruffled plant', function () {
        all_version_tests(build_version_3_world);
    });

    describe('Version 4 - ruffled plant, loaded books', function () {
        all_version_tests(build_version_4_world);
    });
});
