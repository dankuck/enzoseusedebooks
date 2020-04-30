import World from '@world/World';
import Reviver from '@libs/Reviver';

const reviver = new Reviver();

reviver.register(World);

// Add a few built-ins
reviver.add(
    'Date',
    Date,
    (key, value) => new Date(value),
    (key, value) => value
);
reviver.add(
    'Map',
    Map,
    (key, value) => value.reduce((map, entry) => map.set(...entry), new Map()),
    (key, value) => Array.from(value)
);

export default reviver;
