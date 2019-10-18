
export default class Reviver
{
    constructor() {
        this.classes = [];
        this.toJSONs = new Map();
    }

    add(classToRevive, revive, replace) {
        this.classes.push({
            'class': classToRevive,
            revive: revive,
            replace: replace,
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
                    if (value && value.__class__ === match.class.name) {
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
            return value;
        } else {
            return match.revive(key, value.__data__);
        }
    }

    replace(key, value) {
        const match = this.findMatch(value);
        if (!match) {
            return value;
        } else {
            return this.withJSONs(() => {
                let data = match.replace(key, value);
                if (data === value && data.toJSON) {
                    data = data.toJSON();
                }
                return {
                    __class__: match.class.name,
                    __data__: data,
                };
            });
        }
    }

    beforeReplace() {
        this.toJSONs.forEach((value, key) => {
            delete key.prototype.toJSON;
        });
    }

    afterReplace() {
        this.toJSONs.forEach((value, key) => {
            key.prototype.toJSON = value;
        });
    }

    withJSONs(cb) {
        this.afterReplace();
        const result = cb();
        this.beforeReplace();
        return result;
    }

    register(classToRegister) {
        classToRegister.registerReviver(this);
    }
}
