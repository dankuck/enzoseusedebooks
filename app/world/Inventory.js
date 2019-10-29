export default class Inventory {

    constructor(data = {}) {
        Object.assign(this, data);
        if (!this.contents) {
            this.contents = [];
        }
    }

    add(item) {
        this.contents.push(item);
        return this;
    }

    remove(item) {
        const index = this.contents.indexOf(item);
        if (index < 0) {
            return this;
        }
        this.contents.splice(index, 1);
        return this;
    }

    firstWhere(...args) {
        return this.where(...args)[0];
    }

    where(...args) {
        let filter;
        if (args[0] instanceof Function) {
            [filter] = args;
        } else {
            const [field, value] = args;
            filter = item => item[field] === value;
        }
        return this.contents.filter(filter);
    }

    removeWhere(...args) {
        const items = this.where(...args);
        items.forEach(item => this.remove(item));
        return items;
    }

    isEmpty() {
        return this.contents.length === 0;
    }
};

Inventory.registerReviver = function (reviver) {
    reviver.add(
        'Inventory',
        Inventory,
        (key, value) => { return new Inventory(value) },
        (key, value) => { return {...value} },
    );
};
