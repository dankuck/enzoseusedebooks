import VersionUpgrader from '@libs/VersionUpgrader';
import Collection from '@world/Collection';
import axios from 'axios';

const upgrader = new VersionUpgrader()
    .version(1, world => {
        world.plant = {
            animation: 'rest',
            name: 'Suspicious Plant',
            response: "You ruffled the plant. It's messy now.",
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
            bargain: new Collection({
                url:     './data/bargain.json',
                axios:   world.axios,
                key:     ['title'],
                default: {title: ''},
                codes:   [
                    'book1',
                    'book2',
                    'book3',
                    'book4',
                    'book5',
                    'book6',
                    'book7',
                    'book8',
                    'book9',
                    'book10',
                    'book11',
                    'book12',
                ],
            }),
        };
    })
    ;

export default class World
{
    constructor(data = {}) {
        Object.assign(this, data);
        if (!this.axios) {
            this.axios = axios;
        }
        this.version = upgrader.upgrade(this.version || 0, this);
    }

    chooseNameFromCollection(code, collectionName) {
        return this.collections[collectionName].chooseName(code);
    }
};

World.registerReviver = function (reviver) {
    reviver.add(
        World,
        (key, data) => { return new World(data) },
        (key, data) => { return {...data} }
    );
    reviver.register(Collection);
};
