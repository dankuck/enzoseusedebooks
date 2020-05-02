/**
 |-----------------------
 | JsonStorage
 |-----------------------
 | This class writes data as JSON into a given object at a given key.
 |
 | It was written to be used with window.localStorage, but it can work on any
 | object.
 |
 | Example:
 |
 |   const store = {}
 |   const js = new JsonStorage(store, 'myKey');
 |   js.write('item', 123);
 |   console.log(js.read('item'));
 |   // 123
 |   console.log(store);
 |   // {myKey: "{item:123}"}
 |
 | Not all data converts to JSON and back seamlessly. So you may want to
 | convert some parts of your structure to a special format. For that, supply
 | any of the optional functions:
 |  replace - a function that accepts a part of the structure you're
 |            serializing and returns a value you want back when unserializing.
 |            This is passed directly to `JSON.stringify`
 |  revive -  a function that accepts a value from `replace` and returns the
 |            recreated original value. Passed directly to `JSON.parse`
 |  beforeReplace - a function that does whatever prep work you may need before
 |            the replacements
 |  afterReplace  - a function that resets anything you may have changed in
 |            `beforeReplace`.
 |
 | JSON will pass each part of the structures you store to `replace` and
 | `revive` as needed. The parameters will be (`key`, `value`). Return either
 | the same value or a suitable replacement.
 |
 | Hint: The Revive class does a great job supplying those exact functions
 | when you want objects to keep their classes after reload.
 |
 | In this ridiculous example we add an egg emoji to the beginning of every
 | string, for storage, then remove it again on read, so no one is the wiser.
 | We make sure to return the original value for all non-strings:
 |
 |   // Put An Egg On It
 |   const store = {}
 |   const js = new JsonStorage(store, 'myKey', {
 |       revive(k, v) {
 |           return typeof v === 'string'
 |               ? v.replace(/^🥚/, '')
 |               : v
 |       },
 |       replace(k, v) {
 |           return typeof v === 'string'
 |               ? '🥚' + v
 |               : v
 |       },
 |   });
 |   js.write('title', 'The Hound of the Baskervilles');
 |   console.log(js.read('title'));
 |   // The Hound of the Baskervilles
 |   console.log(store)
 |   // {myKey: "{title:\"🥚The Hound of the Baskervilles\"}"}
 */

const justReturnTheValue = (k, v) => v;
const justReturn = () => void(0);

export default class JsonStorage
{
    constructor(
        storage,
        rootKey,
        {
            revive,
            replace,
            beforeReplace,
            afterReplace,
            beforeRevive,
            afterRevive,
        } = {}
    )
    {
        this.storage       = storage;
        this.rootKey       = rootKey;
        this.reviver       = revive        || justReturnTheValue;
        this.replacer      = replace       || justReturnTheValue;
        this.beforeReplace = beforeReplace || justReturn;
        this.afterReplace  = afterReplace  || justReturn;
        this.beforeRevive  = beforeRevive  || justReturn;
        this.afterRevive   = afterRevive   || justReturn;
    }

    getRoot()
    {
        this.beforeRevive();
        const root = this.storage[this.rootKey] ? JSON.parse(this.storage[this.rootKey], this.reviver) : {};
        this.afterRevive();
        return root;
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
