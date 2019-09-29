
export default class Reviver
{
    constructor() {
        this.classes = [];
    }

    add(classToRevive, revive, replace) {
        this.classes.push({
            'class': classToRevive,
            revive: revive,
            replace: replace,
        });
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
            return {
                __class__: match.class.name,
                __data__: match.replace(key, value)
            };
        }
    }

    register(classToRegister) {
        classToRegister.registerReviver(this);
    }
}
