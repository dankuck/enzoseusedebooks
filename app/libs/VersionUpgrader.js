/**
 |--------------------------
 | VersionUpgrader
 |--------------------------
 | This class keeps a list of versions and callbacks to be applied to an
 | object in order. Only versions higher than a given version will be applied.
 |
 | The last version number applied will be returned.
 |
 | Example:
 |  const object = {x: 4};
 |  object.version = new VersionUpgrader()
 |      .version(1, object => object.x = 1)
 |      .version(2, object => {
 |          object.y = {
 |              z: 1,
 |          };
 |      })
 |      .upgrade(1, object);
 |
 | In this example, only version 2 will be applied to the object, because the
 | version passed to `upgrade` was 1. Afterward the object will look like this:
 |  {
 |      x: 4,
 |      y: {
 |          z: 1,
 |      },
 |      version: 2,
 |  }
 |
 | The version does not have to be stored on the object if that is not
 | convenient, but it should be stored somewhere so that it can be passed in
 | again later when the object needs to be upgraded again.
 */

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
        return changes.length ? changes[changes.length - 1].version : version;
    }
}
