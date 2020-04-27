
export default class InventoryDoorbell {

    constructor(data) {
        this.image = 'images/doorbell.gif';
        Object.assign(this, data);
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
