
export default class VersionUpgrader
{

    constructor() {
        this.changes = [];
    }

    version(version, callback) {
        this.changes.push({version, callback});
        return this;
    }

    upgrade(version, object) {
        const changes = this.changes
            .sort((a, b) => a.version - b.version)
            .filter(change => change.version > version);
        changes.forEach(change => change.callback(object));
        return changes[changes.length - 1].version;
    }
}
