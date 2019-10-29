
class ReviverStandin {

    constructor(original, asJSON) {
        this.original = original;
        this.asJSON = asJSON;
    }
}

export default class Reviver
{
    constructor() {
        this.classes = [];
        this.toJSONs = new Map();
    }

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

    replace(key, value) {
        const {original, asJSON} = value instanceof ReviverStandin
            ? value
            : {original: value, asJSON: value};
        const match = this.findMatch(original);
        if (!match) {
            return original;
        } else {
            const replaced = match.replace(key, original);
            return {
                __class__: match.name,
                __data__: replaced === original ? asJSON : replaced,
            };
        }
    }

    beforeReplace() {
        this.toJSONs.forEach((toJSON, targetClass) => {
            targetClass.prototype.toJSON = function () {
                const asJSON = toJSON.apply(this, arguments);
                return new ReviverStandin(this, asJSON);
            };
        });
    }

    afterReplace() {
        this.toJSONs.forEach((toJSON, targetClass) => {
            targetClass.prototype.toJSON = toJSON;
        });
    }

    register(classToRegister) {
        classToRegister.registerReviver(this);
    }
}
