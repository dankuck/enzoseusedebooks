import World from '@world/World';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;

describe('World', function () {

    it('should instantiate', function () {
        new World({});
    });
});
