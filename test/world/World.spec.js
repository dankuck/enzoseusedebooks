import World from '@world/World';
import Collection from '@world/Collection';
import reviver from '@app/reviver';
import assert from 'assert';
import version_3_save from '../fixtures/version_3_save.json';
import version_4_save from '../fixtures/version_4_save.json';
import version_8_minimized_save from '../fixtures/version_8_minimized_save.json';
import wait from '@libs/wait';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const shuffle = function (arr) {
    const copy = [].concat(arr);
    const shuffled = [];
    while (copy.length > 0) {
        shuffled.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return shuffled;
};

const buildWorldBuilder = function (plain_object) {
    const json = JSON.stringify(plain_object);
    return () => loadJSON(json).world;
};
const loadJSON = function (json) {
    return JSON.parse(json, (k, v) => reviver.revive(k, v));
};
const saveJSON = function (world) {
    reviver.beforeReplace();
    const json = JSON.stringify(world, (k, v) => reviver.replace(k, v));
    reviver.afterReplace();
    return json;
};

const build_version_3_world = buildWorldBuilder(version_3_save);
const build_version_4_world = buildWorldBuilder(version_4_save);
const build_version_8_minimized_world = buildWorldBuilder(version_8_minimized_save);

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
            this.slow(2000);
            const world = builder();
            assert(world.lobbyPlant);
            assert(!world.plant); // this old name was deleted
            const keys = Object.keys(world.lobbyPlant).sort();
            assert(keys.includes('animation'));
            assert(keys.includes('name'));
            assert(keys.includes('ruffled'));
        });

        it('should be in the lobby', function () {
            this.slow(2000);
            const world = builder();
            equal('lobby', world.location);
        });

        it('should have bargain books', function () {
            this.slow(2000);
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
            this.slow(2000);
            const world = builder();
            assert(world.collections);
            assert(world.collections.fiction instanceof Collection);
            for (let i = 0; i < 150; i++) {
                assert(world.collections.fiction['book' + i]);
            }
        });

        it('should have nonfiction books', function () {
            this.slow(2000);
            const world = builder();
            assert(world.collections);
            assert(world.collections.nonfiction instanceof Collection);
            for (let i = 0; i < 150; i++) {
                assert(world.collections.nonfiction['book' + i]);
            }
        });

        it('should be able to ruffle the plant', function () {
            this.slow(2000);
            const world = builder();
            const msgs = [];
            if (!world.lobbyPlant.ruffled) {
                world.ruffleLobbyPlant(msg => msgs.push(msg));
                assert(world.lobbyPlant.name, 'Ruffled Plant');
                assert(msgs.includes("You ruffled the plant. Something fell out."));
                assert(world.lobbyPlant.ruffled, true);
            }
            world.ruffleLobbyPlant(msg => msgs.push(msg));
            assert(world.lobbyPlant.name, 'Ruffled Plant');
            assert(msgs.includes("Hasn't this plant been through enough?"));
            assert(world.lobbyPlant.ruffled, true);
        });

        it('should visit another place', function () {
            this.slow(2000);
            const world = builder();
            const place = Math.random();
            const startLength = world.locationHistory.length;
            assert(startLength);
            world.goTo(place);
            assert(world.location === place);
            assert(world.locationHistory.length === startLength + 1);
        });

        it('should not go nowhere', function () {
            this.slow(2000);
            const world = builder();
            const startLength = world.locationHistory.length;
            assert(startLength);
            let caughtError;
            try {
                world.goTo();
            } catch (e) {
                caughtError = e;
            }
            assert(caughtError);
            assert(world.location);
            assert(world.locationHistory.length === startLength);
        });

        it('should know where it has been', function () {
            this.slow(2000);
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
            this.slow(2000);
            const world = builder();
            assert(world.battery);
        });

        it('should have an inventory', function () {
            this.slow(2000);
            const world = builder();
            assert(world.inventory instanceof Array);
        });

        it('should have slim books', function () {
            const world = builder();
            const allBooks = Object.values(world.collections)
                .map(collection => collection.codes.map(code => collection[code]))
                .reduce((all, books) => all.concat(books), []);
            const allKeys = allBooks.reduce((all, book) => all.concat(Object.keys(book)), []);
            const uniqueKeys = new Set(allKeys);
            const extraKeys = new Set(uniqueKeys);
            // remove the ones that are ok in a slim book
            extraKeys.delete('title');
            extraKeys.delete('isbn');
            extraKeys.delete('url');
            extraKeys.delete('image');
            extraKeys.delete('by');
            extraKeys.delete('dimensions');
            extraKeys.delete('published_at');
            extraKeys.delete('prices');
            assert(extraKeys.size === 0, `Some extra keys in some books: ${Array.from(extraKeys)}`);
        });

        it('should have a lobbyBot', function () {
            const world = builder();
            assert(world.lobbyBot);
            assert(world.lobbyBot.askedCodes instanceof Array);
        });

        it('should remember the last three books', function () {
            const world = builder();

            world.markBookViewed('lmnop');
            equal(['lmnop'], world.lastBooksViewed);

            world.markBookViewed('abcdef');
            equal(['lmnop', 'abcdef'], world.lastBooksViewed);

            world.markBookViewed('abcdef');
            equal(['lmnop', 'abcdef'], world.lastBooksViewed);

            world.markBookViewed('12345');
            equal(['lmnop', 'abcdef', '12345'], world.lastBooksViewed);

            world.markBookViewed('XXXXX');
            equal(['abcdef', '12345', 'XXXXX'], world.lastBooksViewed);
        });

        it('should bring the lobby bot back eventually', function (done) {
            const world = builder();

            world.lobbyBotAnswerDoorbell();
            equal('door', world.getLobbyBotLocation());

            world.checkLobbyBotReturn(5);
            equal('door', world.getLobbyBotLocation());

            wait(10)
                .then(() => {
                    world.checkLobbyBotReturn(5);
                    equal('lobby-desk', world.getLobbyBotLocation());
                })
                .then(done, done);
        });

        it('should not bring the lobby bot back if the user is at the desk', function (done) {
            const world = builder();

            world.goTo('lobby-desk');
            world.lobbyBotAnswerDoorbell();
            equal('door', world.getLobbyBotLocation());

            wait(10)
                .then(() => {
                    world.checkLobbyBotReturn(5);
                    equal('door', world.getLobbyBotLocation());
                })
                .then(done, done);
        });

        it('should bring the lobby bot back even if world has been saved and reloaded', function (done) {
            let world = builder();

            world.lobbyBotAnswerDoorbell();
            equal('door', world.getLobbyBotLocation());

            wait(10)
                .then(() => {
                    world = loadJSON(saveJSON(world));
                    assert(world);
                    world.checkLobbyBotReturn(5);
                    equal('lobby-desk', world.getLobbyBotLocation());
                })
                .then(done, done);
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

    describe('Version 8 - minimized, ruffled plant, loaded books', function () {
        all_version_tests(build_version_8_minimized_world);
    });

    describe('knows when all steps are completed', function () {

        const actions = [
            world => world.takeBattery(() => {}),
            world => world.goTo('lobby-desk'),
            world => world.goTo('fiction-stack'),
            world => world.goTo('nonfiction-stack'),
            world => world.goTo('children-stack'),
        ];

        it('in order', function () {
            const world = new World();

            actions.forEach(action => {
                assert(!world.completedAllSteps());
                action(world);
            });

            assert(world.completedAllSteps());
        });

        it('shuffled', function () {
            const world = new World();

            shuffle(actions).forEach(action => {
                assert(!world.completedAllSteps(), `did not need step ${action}`);
                action(world);
            });

            assert(world.completedAllSteps());
        });
    });

    describe('doorbell', function () {

        it('is ready if all the stacks have been visited', function () {
            const actions = [
                world => world.goTo('fiction-stack'),
                world => world.goTo('nonfiction-stack'),
                world => world.goTo('children-stack'),
            ];

            const world = new World();

            shuffle(actions).forEach(action => {
                assert(!world.canFindDoorbell());
                action(world)
            });

            assert(world.canFindDoorbell());
        })

        it('is ready if at least one book has been read', function () {
            const world = new World();

            assert(!world.canFindDoorbell());

            world.markBookViewed('Desert Monkey 2');

            assert(world.canFindDoorbell());

            world.markBookViewed('Desert Monkey 3: The Forgotten');

            assert(world.canFindDoorbell());
        });

        it('is only ready if its location is null', function () {
            const world = new World();

            assert(!world.canFindDoorbell());

            world.markBookViewed('Desert Monkey 2');

            assert(world.canFindDoorbell());

            world.doorbell.location = 'shelf';

            assert(!world.canFindDoorbell());
        });
    });
});
