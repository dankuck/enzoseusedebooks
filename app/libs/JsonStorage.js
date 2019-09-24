/**
 |-----------------------
 | JsonStorage
 |-----------------------
 | This class writes data as JSON into a given object at a given key.
 |
 | It was written to be used with window.localStorage, but it can work on any
 | object.
 */
export default class JsonStorage
{
    constructor(storage, rootKey, {reviver, replacer} = {})
    {
        this.storage = storage;
        this.rootKey = rootKey;
        this.reviver = reviver || ((key, value) => value);
        this.replacer = replacer || ((key, value) => value);
    }

    getRoot()
    {
        return this.storage[this.rootKey] ? JSON.parse(this.storage[this.rootKey], this.reviver) : {};
    }

    setRoot(root)
    {
        this.storage[this.rootKey] = JSON.stringify(root, this.replacer);
    }

    deleteRoot()
    {
        delete this.storage[this.rootKey];
    }

    read(key)
    {
        if (arguments.length === 0) {
            return this.getRoot();
        } else {
            return this.getRoot()[key];
        }
    }

    write(key, data)
    {
        const root = this.getRoot();
        if (arguments.length === 1) {
            for (let field in key) {
                root[field] = key[field];
            }
        } else {
            root[key] = data;
        }
        this.setRoot(root);
    }

    delete(key)
    {
        if (arguments.length === 0) {
            this.deleteRoot();
        } else {
            const root = this.getRoot();
            delete root[key];
            this.setRoot(root);
        }
    }
};
