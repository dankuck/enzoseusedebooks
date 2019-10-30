import InventoryBattery from '@world/InventoryBattery';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

const classes = {
    InventoryBattery: function() {
        return new InventoryBattery({name: Math.random()});
    },
};

Object.keys(classes).forEach(className => {

    const builder = classes[className];

    describe(className, function () {

        it('has a name and an image', function () {
            const instance = builder();
            assert(instance.name);
            assert(instance.image);
        });

        it('can replace and revive', function () {
            const instance = builder();
            const {name, image} = instance;
            let reviver;
            instance.constructor.registerReviver({
                add(name, Class, revive, replace) {
                    reviver = {
                        name,
                        Class,
                        revive,
                        replace,
                    };
                },
            });
            const copy = reviver.revive('', reviver.replace('', instance));
            equal(instance, copy);
        });
    });
});
