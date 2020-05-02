/**
 |------------------------
 | Reviver
 |------------------------
 | Use the reviver to save objects with their proper class data to a JSON
 | string, or load them from one.
 |
 | Example:
 |  const reviver = new Reviver();
 |  reviver.add(
 |      'Date',
 |      Date,
 |      (key, value) => new Date(value),
 |      (key, value) => value
 |  );
 |  const data = {
 |      'title': 'Champagne Supernova',
 |      'created_at': new Date('1996-05-13'),
 |  };
 |  reviver.beforeReplace();
 |  const JSON.stringify(data, reviver.replace)
 |  reviver.afterReplace();
 |  const copy = JSON.parse(json, reviver.revive)
 |  console.log(data, copy);
 |  // Then you see the same thing twice.
 */
export default class Reviver
{
    constructor() {
        this.classes = [];
        this.toJSONs = new Map();
        this.registerBuiltIns();
        this.revive = this.revive.bind(this);
        this.replace = this.replace.bind(this);
        this.beforeReplace = this.beforeReplace.bind(this);
        this.afterReplace = this.afterReplace.bind(this);
    }

    /**
     * Provide the callbacks to revive or replace a given class.
     *
     * @param {string} name          What the class is called in string output
     * @param {Class} classToRevive  The class itself
     * @param {Function} revive      A function to turn a plain object into a
     *                               class instance. Expect to receive the
     *                               parameters `key`, `value`.
     * @param {Function} replace     A function to turn a class instance into
     *                               a plain object. Expect to receive the
     *                               parameters `key`, `value`.
     */
    add(name, classToRevive, revive, replace) {
        this.classes.push({
            name,
            'class': classToRevive,
            revive,
            replace,
        });
        if (classToRevive.prototype.toJSON) {
            this.toJSONs.set(classToRevive, classToRevive.prototype.toJSON);
        }
    }

    /**
     * Used internally to find the right reviver or replacer to use
     *
     * @param  {any} value
     * @return {Object|null}
     */
    findMatch(value) {
        return this.classes
            .reduce(
                (found, match) => {
                    if (found) {
                        return found;
                    }
                    if (value instanceof match.class) {
                        return match;
                    }
                    if (value && value.__class__ === match.name) {
                        return match;
                    }
                    return null;
                },
                null
            );
    }

    /**
     * Use this with JSON.parse() to load saved data.
     *
     * Example: JSON.parse(data, reviver.revive)
     *
     * @param  {string} key
     * @param  {any} value
     * @return {any}
     */
    revive(key, value) {
        const match = this.findMatch(value);
        if (!match) {
            if (value && value.__class__) {
                return null; // sorry, your data is dead
            } else {
                return value;
            }
        } else {
            return match.revive(key, value.__data__);
        }
    }

    /**
     * Use this with JSON.stringify() to save data as JSON.
     *
     * You must use `beforeReplace` and `afterReplace` before and after the
     * call to stringify to ensure that classes with toJSON methods are saved
     * correctly.
     *
     * Example:
     *     reviver.beforeReplace();
     *     JSON.stringify(data, reviver.replace)
     *     reviver.afterReplace();
     *
     * @param  {string} key
     * @param  {any} value
     * @return {any}
     */
    replace(key, value) {
        const {original, asJSON} = value instanceof ReviverStandin
            ? value
            : {original: value, asJSON: COPY_VALUE};
        const match = this.findMatch(original);
        if (!match) {
            return original;
        } else {
            const replacement = match.replace(key, original);
            return {
                __class__: match.name,
                // If match.replace returned `original` itself, we need to
                // ensure we don't pass the same value into __data__ and
                // end up in a loop. So...
                // If the replacement is a true replacement, use it
                // If the asJSON was gathered from a ReviverStandin, use it
                // If the asJSON is the special COPY_VALUE value, copy the
                // object on the fly.
                // This is fairly speedy.
                __data__: replacement !== original
                    ? replacement
                    : asJSON !== COPY_VALUE
                    ? asJSON
                    : {...value},
            };
        }
    }

    /**
     * toJSON gets in the way of what we need to do here. So we get rid of all
     * the toJSONs before doing a save. Run afterReplace when you're done to
     * ensure they all get put back where they belong.
     * @return {void}
     */
    beforeReplace() {
        this.toJSONs.forEach((toJSON, targetClass) => {
            targetClass.prototype.toJSON = function () {
                const asJSON = toJSON.apply(this, arguments);
                return new ReviverStandin(this, asJSON);
            };
        });
    }

    /**
     * After doing a save, be sure to run this so all the toJSON methods get
     * put back on their classes.
     * @return {void}
     */
    afterReplace() {
        this.toJSONs.forEach((toJSON, targetClass) => {
            targetClass.prototype.toJSON = toJSON;
        });
    }

    /**
     * You should write classes with registryReviver() class methods and pass
     * those classes to this method.
     *
     * @param  {Class} classToRegister
     * @return {void}
     */
    register(classToRegister) {
        classToRegister.registerReviver(this);
    }

    registerBuiltIns() {
        this.add(
            'Date',
            Date,
            (key, value) => new Date(value),
            (key, value) => value
        );
        this.add(
            'Map',
            Map,
            (key, value) => value.reduce((map, entry) => map.set(...entry), new Map()),
            (key, value) => Array.from(value)
        );
    }
}

class ReviverStandin {

    constructor(original, asJSON) {
        this.original = original;
        this.asJSON = asJSON;
    }
}

const COPY_VALUE = {};
