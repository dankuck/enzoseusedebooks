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
        return this.axios.get(`./data/${this.name}.json`)
            .then(response => {
                const items = response.data;
                this.pendingCodes.forEach(code => {
                    const index = Math.floor(Math.random() * items.length);
                    this[code] = items.splice(index, 1)[0];
                });
            });
    }
};

Collection.registerReviver = function (reviver) {
    reviver.add(
        Collection,
        (key, data) => { return new Collection(data) },
        (key, data) => { return {...data} }
    );
};
