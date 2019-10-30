
export default class InventoryBattery {

    constructor(data) {
        this.image = 'images/battery.gif';
        Object.assign(this, data);
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
