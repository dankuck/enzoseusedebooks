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
    constructor(storage, rootKey, transformer = null)
    {
        this.storage = storage;
        this.rootKey = rootKey;
        this.reviver = (key, value) => transformer && transformer.revive ? transformer.revive(key, value) : value;
        this.replacer = (key, value) => transformer && transformer.replace ? transformer.replace(key, value) : value;
        this.beforeReplace = () => transformer && transformer.beforeReplace && transformer.beforeReplace();
        this.afterReplace = () => transformer && transformer.afterReplace && transformer.afterReplace();
    }

    getRoot()
    {
        return this.storage[this.rootKey] ? JSON.parse(this.storage[this.rootKey], this.reviver) : {};
    }

    setRoot(root)
    {
        this.beforeReplace();
        this.storage[this.rootKey] = JSON.stringify(root, this.replacer);
        this.afterReplace();
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
