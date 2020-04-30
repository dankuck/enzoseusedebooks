import World from '@world/World';
import Reviver from '@libs/Reviver';

const reviver = new Reviver();

reviver.register(World);

export default reviver;
