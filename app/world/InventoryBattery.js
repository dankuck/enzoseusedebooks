
export default class InventoryBattery {

    constructor(data) {
        this.image = 'images/battery.gif';
        Object.assign(this, data);
    }

    click({print, useWith, world}) {
        useWith(item => {
            if (item.useBattery) {
                item.useBattery(print);
                world.removeInventory(this);
                world.battery.location = 'used';
            } else {
                print("I don't know how to use the battery with that.");
            }
        });
    }
};

InventoryBattery.registerReviver = function (reviver) {
    reviver.add(
        'InventoryBattery',
        InventoryBattery,
        (key, value) => new InventoryBattery(value),
        (key, value) => { return {...value} },
    );
};
