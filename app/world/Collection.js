import axios from 'axios';

export default class Collection
{
    constructor(data = {}) {
        Object.assign(this, data);
        if (!this.axios) {
            this.axios = axios;
        }
        if (!this.key) {
            this.key = [];
        }
        if (!this.codes) {
            this.codes = [];
        }
        if (!this.pendingCodes) {
            this.pendingCodes = this.codes
                .filter(code => !this[code]);
        }
        if (!this.default) {
            this.default = {};
        }
        this.pendingCodes
            .forEach(code => this[code] = {...this.default});
    }

    load() {
        if (this.loading) {
            return this.loading;
        }
        if (this.pendingCodes.length === 0) {
            return Promise.resolve();
        }
        this.loading = this.axios.get(this.url)
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
        'Collection',
        Collection,
        (key, data) => { return new Collection(data) },
        (key, data) => {
            const collection = {...data};
            delete collection.axios;
            delete collection.loading;
            return collection;
        }
    );
};
