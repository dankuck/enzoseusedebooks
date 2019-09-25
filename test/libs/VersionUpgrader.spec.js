import VersionUpgrader from '@libs/VersionUpgrader';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;

describe('VersionUpgrader', function () {

    it('should instantiate', function () {
        new VersionUpgrader();
        // no whammy
    });

    it('should add an version', function () {
        new VersionUpgrader()
            .version(2, thing => {});
        // no whammy
    });

    it('should add two versions in chain', function () {
        new VersionUpgrader()
            .version(2, thing => {})
            .version(3, thing => {});
        // no whammy
    });

    it('should apply changes to object', function () {
        const object = {};
        new VersionUpgrader()
            .version(2, thing => {
                thing.x = 1;
            })
            .upgrade(0, object);
        equal(1, object.x);
    });

    it('should apply several changes to object', function () {
        const object = {};
        new VersionUpgrader()
            .version(2, thing => {
                thing.x = 1;
            })
            .version(3, thing => {
                thing.y = 2;
            })
            .upgrade(0, object);
        equal(1, object.x);
        equal(2, object.y);
    });

    it('should apply changes in version order, not definition order', function () {
        const object = {};
        new VersionUpgrader()
            .version(3, thing => {
                thing.x = 2;
            })
            .version(2, thing => {
                thing.x = 1;
            })
            .upgrade(0, object);
        equal(2, object.x);
    });

    it('should apply future changes only', function () {
        const object = {
            x: 3,
        };
        new VersionUpgrader()
            .version(2, thing => {
                thing.x = 1;
            })
            .version(3, thing => {
                thing.y = 2;
            })
            .upgrade(2, object);
        equal(3, object.x);
        equal(2, object.y);
    });

    it('should apply changes with same version number', function () {
        const object = {};
        new VersionUpgrader()
            .version(2, thing => {
                thing.x = 1;
            })
            .version(2, thing => {
                thing.y = 2;
            })
            .upgrade(0, object);
        equal(1, object.x);
        equal(2, object.y);
    });

    it('should return the new version number', function () {
        const object = {};
        const newVersion = new VersionUpgrader()
            .version(3, thing => {})
            .version(2, thing => {})
            .upgrade(0, object);
        equal(3, newVersion);
    });

    it('should do nothing when up to date', function () {
        const object = {};
        const newVersion = new VersionUpgrader()
            .version(3, thing => assert(false))
            .version(2, thing => assert(false))
            .upgrade(3, object);
        equal(3, newVersion);
    });
});
