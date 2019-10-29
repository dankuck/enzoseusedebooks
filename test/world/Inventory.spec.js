import Inventory from '@world/Inventory';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe.only('Inventory', function () {

    it('instantiates', function () {
        new Inventory({});
    });

    it('is empty', function () {
        assert(new Inventory({}).isEmpty());
    });

    it('adds an item', function () {
        const inventory = new Inventory({});
        inventory.add({
            name: 'Name',
            image: 'image.jpg',
        });
        assert(! inventory.isEmpty());
    });

    it('finds an item', function () {
        const inventory = new Inventory({});
        const item = {
            name: 'Name',
            image: 'image.jpg',
        };
        inventory.add(item);
        equal(item, inventory.firstWhere('name', 'Name'));
    });

    it('does not get wrong item', function () {
        const inventory = new Inventory({});
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        inventory.add(item1).add(item2);
        equal(item2, inventory.firstWhere('name', 'Name2'));
    });

    it('exposes a contents field', function () {
        const inventory = new Inventory({});
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        inventory.add(item1).add(item2);
        assert(inventory.contents.includes(item1));
        assert(inventory.contents.includes(item2));
        assert(inventory.contents.length === 2);
    });

    it('removes item', function () {
        const inventory = new Inventory({});
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        inventory.add(item1).add(item2);
        inventory.remove(item1);
        assert(inventory.contents.includes(item2));
        assert(inventory.contents.length === 1);
    });

    it('removes item by name', function () {
        const inventory = new Inventory({});
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        inventory.add(item1).add(item2);
        inventory.removeWhere('name', 'Name1');
        assert(inventory.contents.includes(item2));
        assert(inventory.contents.length === 1);
    });

    it('accepts a callback for *where', function () {
        const inventory = new Inventory({});
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        inventory.add(item1).add(item2);
        assert(inventory.where(item => item.name === 'Name1').length === 1);
        equal(item1, inventory.firstWhere(item => item.name === 'Name1'));
        equal([item1], inventory.removeWhere(item => item.name === 'Name1'));
        assert(inventory.contents.length === 1);
    });

    it('starts up with the contents specified', function () {
        const item1 = {
            name: 'Name1',
            image: 'image1.jpg',
        };
        const item2 = {
            name: 'Name2',
            image: 'image2.jpg',
        };
        const inventory = new Inventory({contents: [item1, item2]});
        equal([item1, item2], inventory.contents);
    });

    it('registers with a reviver', function () {
        let revive;
        const reviver = {
            add(name, cls, reviver, replacer) {
                if (cls === Inventory) {
                    revive = {reviver, replacer};
                }
            }
        };
        Inventory.registerReviver(reviver);
        assert(revive);
        assert(revive.reviver('', {}) instanceof Inventory);
        assert(revive.replacer('', new Inventory({})).contents);
    });
});
