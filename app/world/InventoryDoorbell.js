
export default class InventoryDoorbell {

    constructor(data) {
        this.image = 'images/doorbell.gif';
        this.hasBattery = false;
        Object.assign(this, data);
    }

    click(print) {
        if (this.hasBattery) {
            print("DING DONG!");
        } else {
            print("Nothing happened. It looks like it needs a battery.");
        }
    }

    useBattery(print) {
        print("The battery fits in the doorbell!");
        this.hasBattery = true;
    }
};

InventoryDoorbell.registerReviver = function (reviver) {
    reviver.add(
        'InventoryDoorbell',
        InventoryDoorbell,
        (key, value) => new InventoryDoorbell(value),
        (key, value) => { return {...value} },
    );
};
