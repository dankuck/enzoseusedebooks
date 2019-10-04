import axios from 'axios';

export default class Collection
{
    constructor(data, codes, defaultItem = {}) {
        Object.assign(this, data);
        if (!this.axios) {
            this.axios = axios;
        }
        this.pendingCodes = codes;
        codes.forEach(code => { if (!this[code]) this[code] = {...defaultItem} });
    }

    load() {
        if (this.loading) {
            return this.loading;
        }
        if (this.pendingCodes.length === 0) {
            return Promise.resolve();
        }
        this.loading = this.axios.get(`./data/${this.name}.json`)
            .then(response => {
                delete this.loading;
                const items = response.data;
                [...this.pendingCodes].forEach((code, i) => {
                    if (items.length === 0) {
                        throw new Error('No items left');
                    }
                    const index = Math.floor(Math.random() * items.length);
                    this[code] = items.splice(index, 1)[0];
                    this.pendingCodes.splice(i, 1);
                });
            });
        return this.loading;
    }
};

Collection.registerReviver = function (reviver) {
    reviver.add(
        Collection,
        (key, data) => { return new Collection(data) },
        (key, data) => { return {...data} }
    );
};
