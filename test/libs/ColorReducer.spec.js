import ColorReducer from '../../app/libs/ColorReducer.js';
import assert from 'assert';
import flops, {estimateOperations} from '../fixtures/flops.js';
const {deepStrictEqual: equal} = assert;

describe('ColorReducer', function () {

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

    it('quickly deals with 1,000,000 pixels', function () {
        this.slow(200);
        const imageData = {
            data: new Array(4000000),
        };
        const data = imageData.data;
        for (let i = 0; i < 4000000; i += 4) {
            data[i + 0] = i % 48;
            data[i + 1] = i % 192;
            data[i + 2] = i % 255;
            data[i + 3] = 255;
        }
        const reducer = new ColorReducer(24);
        let result;
        const ops = estimateOperations(() => result = reducer.adjustImageData(imageData));
        assert(result);
        // 12.8 million is the largest measured value, so we compare to something a bit larger
        assert(ops < 20e6, `Process completed in ${ops} operations >= 20 million`);
    });
});
