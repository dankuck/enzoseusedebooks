import VersionUpgrader from '@libs/VersionUpgrader';
import Collection from '@world/Collection';
import InventoryBattery from '@world/InventoryBattery';

const upgrader = new VersionUpgrader()
    .version(1, world => {
        world.plant = {
            animation: 'rest',
            name: 'Suspicious Plant',
            ruffled: false,
        };
    })
    .version(2, world => {
        world.lobbyPlant = world.plant;
        delete world.plant;
    })
    .version(3, world => world.location = 'lobby')
    .version(4, world => {
        world.collections = {
            bargain: new Collection({
                url:     './data/bargain.json',
                key:     ['title'],
                default: {title: ''},
                codes:   [
                    'book1',
                    'book2',
                    'book3',
                    'book4',
                    'book5',
                    'book6',
                    'book7',
                    'book8',
                    'book9',
                    'book10',
                    'book11',
                    'book12',
                ],
            }),
        };
    })
    .version(5, world => {
        const codes = [];
        for (let i = 0; i < 150; i++) {
            codes.push('book' + i);
        }
        world.collections.fiction = new Collection({
            url:     './data/fiction.json',
            key:     ['title'],
            default: {title: ''},
            codes,
        });
    })
    .version(6, world => {
        world.locationHistory = [{location: world.location, date: new Date()}];
    })
    .version(7, world => {
        const codes = [];
        for (let i = 0; i < 150; i++) {
            codes.push('book' + i);
        }
        world.collections.nonfiction = new Collection({
            url:     './data/nonfiction.json',
            key:     ['title'],
            default: {title: ''},
            codes,
        });
    })
    .version(8, world => {
        const codes = [];
        for (let i = 0; i < 100; i++) {
            codes.push('book' + i);
        }
        world.collections.children = new Collection({
            url:     './data/children.json',
            key:     ['title'],
            default: {title: ''},
            codes,
        });
    })
    .version(9, world => {
        world.battery = {
            location: 'plant',
        };
    })
    .version(10, world => {
        world.inventory = [];
    })
    .version(11, world => {
        // Discard some unneeded data to save space in localStorage
        world.slimDownBooks();
    })
    .version(12, world => {
        world.lobbyBot = {
            askedCodes: [],
        };
    })
    ;

export default class World
{
    constructor(data = {}) {
        Object.assign(this, data);
        this.version = upgrader.upgrade(this.version || 0, this);
    }

    /**
     * Set the plant in the lobby to ruffled. If battery is in the plant, move
     * it to the lobby floor.
     *
     * @param  {Function} print - accepts strings to echo to the user
     * @return {void}
     */
    ruffleLobbyPlant(print) {
        print(
            this.lobbyPlant.ruffled
                ? "Hasn't this plant been through enough?"
                : "You ruffled the plant. It's messy now."
        );

        this.lobbyPlant.name = 'Ruffled Plant';
        this.lobbyPlant.ruffled = true;

        if (this.battery.location === 'plant') {
            this.battery.location = 'lobby-floor';
            print(`Something fell out of the ${this.lobbyPlant.name}.`);
        }
    }

    /**
     * Move the battery into the inventory.
     *
     * @param  {Function} print - accepts strings to echo to the user
     * @return {void}
     */
    takeBattery(print) {
        this.battery.location = 'inventory';
        this.inventory.push(new InventoryBattery({name: 'AA Battery'}));
        print("You've taken the AA Battery");
    }

    /**
     * Attempt to move the user to this place
     * @param  {String} location
     * @return {void}
     */
    goTo(location) {
        if (!location) {
            throw new Error('Cannot go nowhere');
        }
        this.location = location;
        this.locationHistory.push({location, date: new Date()});
    }

    /**
     * True iff the user has visited this place
     *
     * @param  {string}  location
     * @return {Boolean}
     */
    hasGoneTo(location) {
        return this.locationHistory
            .reduce((found, record) => found || record.location === location, false);
    }

    /**
     * Some old books were too large, and we respect our users' storage
     * restraints
     *
     * @return {void}
     */
    slimDownBooks() {
        Object.values(this.collections)
            .forEach(collection => {
                collection.allLoaded().forEach(book => {
                    delete book.small_image;
                    delete book.large_image;
                    delete book.is_adult_only;
                    delete book.languages;
                    delete book.has_english;
                    delete book.pages;
                    delete book.is_memorabilia;
                    delete book.offer_counts;
                    delete book.categories;
                    delete book.full_categories;
                    delete book.is_fiction;
                    delete book.search;
                    delete book.tags;
                    delete book.format;
                });
            });
    }

    completedAllSteps() {
        if (this.battery.location === 'plant') {
            return false; // gotta shake the plant
        }
        if (this.battery.location === 'lobby-floor') {
            return false; // gotta pick up the battery
        }
        const beenEverywhereMan = this.hasGoneTo('lobby-desk')
            && this.hasGoneTo('lobby')
            && this.hasGoneTo('fiction-stack')
            && this.hasGoneTo('nonfiction-stack')
            && this.hasGoneTo('children-stack');
        if (!beenEverywhereMan) {
            return false;
        }
        return true;
    }
};

World.registerReviver = function (reviver) {
    reviver.add(
        'World',
        World,
        (key, data) => { return new World(data) },
        (key, data) => { return {...data} }
    );
    // When we first launched Enzo's, we minimized all the code and World got
    // renamed. Now we are safe against that happening, but we need to be able
    // to handle names from that era.
    reviver.add(
        'ot',
        World,
        (key, data) => { return new World(data) },
        (key, data) => { return {...data} }
    );
    reviver.register(Collection);
    reviver.register(InventoryBattery);
};
