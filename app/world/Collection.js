import VersionUpgrader from '@libs/VersionUpgrader';
import axios from 'axios';

const upgrader = new VersionUpgrader()
    .version(1, collection => {
        collection.loadedAt = collection.codes.length === collection.pendingCodes.length
            ? null
            : new Date(); // in this case, we're upgrading from a previous state
    })
    ;

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
        this.version = upgrader.upgrade(this.version || 0, this);
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
                this.loadedAt = new Date();
                this.fulfillPending(this.removeUsed(response.data));
            });
        return this.loading;
    }

    get(codes) {
        return codes.map(code => this[code]);
    }

    all() {
        return this.get(this.codes);
    }

    allLoaded() {
        return this.get(
            this.codes.filter(code => ! this.pendingCodes.includes(code))
        );
    }

    allPending() {
        return this.get(this.pendingCodes);
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
    const revive = (key, data) => { return new Collection(data) };
    const replace = (key, data) => {
        const collection = {...data};
        delete collection.axios;
        delete collection.loading;
        return collection;
    };
    reviver.add(
        'Collection',
        Collection,
        revive,
        replace,
    );
    // When we first launched Enzo's, we minimized all the code and Collection
    // got renamed. Now we are safe against that happening, but we need to be
    // able to handle names from that era.
    reviver.add(
        'it',
        Collection,
        revive,
        replace,
    );
};
