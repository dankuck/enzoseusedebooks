import ColorReducer from '../../app/libs/ColorReducer.js';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;

describe.only('ColorReducer', function () {

    it('instantiates', function () {
        new ColorReducer(2);
    });

    it('reduces colors to 2 colors per channel', function () {
        const imageData = {
            data: [
                0, 0, 0, 255,
                255, 255, 255, 255,
                128, 128, 128, 255,
                127, 127, 127, 255,
                0, 127, 128, 255,
            ],
        };
        const reducer = new ColorReducer(2);
        const result = reducer.adjustImageData(imageData);
        assert(result);
        equal(
            [
                0, 0, 0, 255,
                255, 255, 255, 255,
                255, 255, 255, 255,
                0, 0, 0, 255,
                0, 0, 255, 255,
            ],
            imageData.data
        );
    });

    it('reduces colors to 3 colors per channel', function () {
        const imageData = {
            data: [
                0, 0, 0, 255,
                255, 255, 255, 255,
                128, 128, 128, 255,
                64, 64, 64, 255,
                63, 63, 63, 255,
                192, 192, 192, 255,
                191, 191, 191, 255,
            ],
        };
        const reducer = new ColorReducer(3);
        const result = reducer.adjustImageData(imageData);
        assert(result);
        equal(
            [
                0, 0, 0, 255,
                255, 255, 255, 255,
                128, 128, 128, 255,
                128, 128, 128, 255,
                0, 0, 0, 255,
                255, 255, 255, 255,
                128, 128, 128, 255,
            ],
            imageData.data
        );
    });

    it('reduces colors to 4 colors per channel', function () {
        const imageData = {
            data: [
                0, 8, 16, 255,
                32, 48, 63, 255,
                64, 127, 128, 255,
                191, 192, 254, 255,
            ],
        };
        const reducer = new ColorReducer(4);
        const result = reducer.adjustImageData(imageData);
        assert(result);
        equal(
            [
                0, 0, 0, 255,
                0, 85, 85, 255,
                85, 85, 170, 255,
                170, 170, 255, 255,
            ],
            imageData.data
        );
    });

    it('reduces colors to 5 colors per channel', function () {
        const imageData = {
            data: [
                0, 8, 16, 255,
                32, 48, 63, 255,
                64, 127, 128, 255,
                191, 192, 254, 255,
            ],
        };
        const reducer = new ColorReducer(5);
        const result = reducer.adjustImageData(imageData);
        assert(result);
        equal(
            [
                0, 0, 0, 255,
                64, 64, 64, 255,
                64, 128, 128, 255,
                191, 191, 255, 255,
            ],
            imageData.data
        );
    });
});
