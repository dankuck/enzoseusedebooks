
export default class Collection
{
    constructor(name, axios) {
        this.name = name;
        this.axios = axios;
        this.names = null;
        this.chosen = {};
    }

    chooseName(code) {
        if (this.chosen[code]) {
            return Promise.resolve(this.chosen[code]);
        }
        return this.loadNames()
            .then(names => {
                if (names.length === 0) {
                    throw `No names left in ${this.name}`;
                }
                const index = Math.floor(Math.random() * names.length);
                this.chosen[code] = names.splice(index, 1)[0];
                return this.chosen[code];
            });
    }

    loadNames() {
        if (this.names) {
            return Promise.resolve(this.names);
        }
        return this.axios.get(`./data/${this.name}-names.json`)
            .then(response => {
                this.names = response.data;
                return this.names;
            });
    }
}


Collection.addToReviver = function (reviver, axios) {
    reviver.add(
        Collection,
        (key, data) => { return new Collection(data, axios) },
        (key, data) => {
            const converted = {...Collection};
            delete converted.axios;
            return converted;
        }
    );
};
