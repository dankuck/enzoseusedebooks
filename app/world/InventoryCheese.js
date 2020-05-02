
export default class InventoryCheese {

    constructor(data) {
        this.image = 'images/cheese.gif';
        Object.assign(this, data);
    }
};

InventoryCheese.registerReviver = function (reviver) {
    reviver.add(
        'InventoryCheese',
        InventoryCheese,
        (key, value) => new InventoryCheese(value),
        (key, value) => { return {...value} },
    );
};
