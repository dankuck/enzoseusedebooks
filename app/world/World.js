import VersionUpgrader from '@libs/VersionUpgrader';
import Collection from '@world/Collection';

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
    })
    .version(3, world => world.location = 'lobby')
    .version(4, world => {
        world.collections = {
            bargain:    new Collection('bargain', world.axios),
            children:   new Collection('children', world.axios),
            fiction:    new Collection('fiction', world.axios),
            nonfiction: new Collection('nonfiction', world.axios),
        };
    })
    ;

export default class World
{
    constructor(data = {}, axios = null) {
        this.axios = axios;
        Object.assign(this, data);
        this.version = upgrader.upgrade(this.version || 0, this);
    }

    chooseNameFromCollection(code, collectionName) {
        return this.collections[collectionName].chooseName(code);
    }
};

World.addToReviver = function (reviver, axios) {
    reviver.add(
        World,
        (key, data) => { return new World(data, axios) },
        (key, data) => {
            const converted = {...World};
            delete converted.axios;
            return converted;
        }
    );
    Collection.addToReviver(reviver, axios);
};

