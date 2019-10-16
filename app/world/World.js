import VersionUpgrader from '@libs/VersionUpgrader';
import Collection from '@world/Collection';

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
    .version(5, world => {
        const codes = [];
        for (let i = 0; i < 150; i++) {
            codes.push('book' + i);
        }
        world.collections.fiction = new Collection({
            url:     './data/fiction.json',
            key:     ['title'],
            default: {title: ''},
            codes,
        });
    })
    ;

export default class World
{
    constructor(data = {}) {
        Object.assign(this, data);
        this.version = upgrader.upgrade(this.version || 0, this);
    }

    ruffleLobbyPlant() {
        this.lobbyPlant.name = 'Ruffled Plant';
        this.lobbyPlant.response = "Hasn't this plant been through enough?";
        this.lobbyPlant.ruffled = true;
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
