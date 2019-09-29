import axios from 'axios';

export default class Collection
{
    constructor(data) {
        this.names = null;
        this.chosen = {};
        Object.assign(this, data);
        if (!this.axios) {
            this.axios = axios;
        }
    }

    chooseName(code) {
        return this.loadNames()
            .then(names => {
                if (!this.chosen[code]) {
                    if (names.length === 0) {
                        throw `No names left in ${this.name}`;
                    }
                    const index = Math.floor(Math.random() * names.length);
                    this.chosen[code] = names.splice(index, 1)[0];
                }
                return this.chosen[code];
            });
    }

    loadNames() {
        if (this.names) {
            return Promise.resolve(this.names);
        }
        return this.axios.get(`./data/${this.name}-names.json`)
            .then(response => {
                // avoid race conditions
                if (!this.names) {
                    this.names = response.data;
                }
                return this.names;
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
