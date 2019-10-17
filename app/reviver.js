import World from '@world/World';
import Reviver from '@libs/Reviver';

const reviver = new Reviver();

reviver.register(World);
reviver.add(
    Date,
    (key, value) => new Date(value),
    (key, value) => value
);

export default reviver;
