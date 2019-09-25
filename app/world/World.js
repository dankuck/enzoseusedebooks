import VersionUpgrader from '@libs/VersionUpgrader';

const upgrader = new VersionUpgrader()
    .version(1, world => {
        world.plant = {
            animation: 'rest',
            name: 'Suspicious Plant',
            response: "You ruffled the plant.\nIt's messy now.",
            ruffled: false,
        };
    })
    .version(2, world => {
        world.lobbyPlant = world.plant;
        delete world.plant;
    });

export default class World
{
    constructor(data = {}) {
        Object.assign(this, data);
        this.version = upgrader.upgrade(this.version || 0, this);
    }

    replaceForJson() {
        return Object.assign({}, this);
    }
};

World.reviveFromJson = function (data) {
    return new World(data);
};
