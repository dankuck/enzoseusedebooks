import axios from 'axios';

export default class Collection
{
    constructor(data, codes, key = [], defaultItem = {}) {
        Object.assign(this, data);
        if (!this.axios) {
            this.axios = axios;
        }
        this.key = key;
        this.pendingCodes = codes
            .filter(code => !this[code]);
        this.pendingCodes
            .forEach(code => this[code] = {...defaultItem});
    }

    load() {
        if (this.loading) {
            return this.loading;
        }
        if (this.pendingCodes.length === 0) {
            return Promise.resolve();
        }
        this.loading = this.axios.get(`./data/${this.name}.json`)
            .finally(() => delete this.loading)
            .then(response => {
                this.fulfillPending(this.removeUsed(response.data));
            });
        return this.loading;
    }

    fulfillPending(items) {
        items = [...items];
        this.pendingCodes = this.pendingCodes
            .filter(code => {
                if (items.length === 0) {
                    return true;
                } else {
                    const index = Math.floor(Math.random() * items.length);
                    this[code] = items.splice(index, 1)[0];
                    return false;
                }
            });
        if (this.pendingCodes.length > 0) {
            throw new Error('Not enough items');
        }
    }

    removeUsed(items) {
        items = [...items];
        if (this.key.length === 0) {
            return items;
        }
        const key = (item) => this.key.map(field => item[field]).join(':');
        const used = Object.values(this)
            .filter(item => typeof item === 'object')
            .map(key);
        return items.filter(item => !used.includes(key(item)));
    }
};

Collection.registerReviver = function (reviver) {
    reviver.add(
        Collection,
        (key, data) => { return new Collection(data) },
        (key, data) => { return {...data} }
    );
};
