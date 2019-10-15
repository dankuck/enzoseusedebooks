/**
 |--------------------
 | ColorReducer
 |--------------------
 | Rounds the values in each RGB channel to a reduced set of values.
 |
 | `new ColorReducer(2)` would make each channel have 2 values, 0 and 255, so
 | the 8 colors (2^3) would be:
 | [  0,   0,   0] = black    [255,   0,   0] = red
 | [  0,   0, 255] = blue     [255,   0, 255] = magenta
 |
 | [  0, 255,   0] = green    [255, 255,   0] = yellow
 | [  0, 255, 255] = cyan     [255, 255, 255] = white
 |
 |
 | `new ColorReducer(3)` would make each channel have 3 values, 0, 128, and
 | 255, so the 27 (3^3) colors would be:
 | [  0,   0,   0] = black          [128,   0,   0] = dark red        [255,   0,   0] = red
 | [  0,   0, 128] = dark blue      [128,   0, 128] = dark pink       [255,   0, 128] = pink
 | [  0,   0, 255] = blue           [128,   0, 255] = purple          [255,   0, 255] = magenta
 |
 | [  0, 128,   0] = dark green     [128, 128,   0] = dark yellow     [255, 128,   0] = leaf orange
 | [  0, 128, 128] = dark cyan      [128, 128, 128] = grey            [255, 128, 128] = pastel pink
 | [  0, 128, 255] = sky blue       [128, 128, 255] = light purple    [255, 128, 255] = bubble gum pink
 |
 | [  0, 255,   0] = green          [128, 255,   0] = bright green    [255, 255,   0] = yellow
 | [  0, 255, 128] = light green    [128, 255, 128] = pastel gren     [255, 255, 128] = pastel yellow
 | [  0, 255, 255] = cyan           [128, 255, 255] = light cyan      [255, 255, 255] = white
 */

export default class ColorReducer {

    constructor(colorsPerChannel) {
        this.colorsPerChannel = colorsPerChannel;
    }

    adjustImageData(imageData) {
        const data = imageData.data;
        const length = data.length;
        const segments = this.colorsPerChannel - 1;
        const toLowRes = segments / 255;
        const toHiRes = 255 / segments;
        for (let i = 0; i < length; i += 4) {
            if (data[i + 3] > 0) {
                data[i + 0] = Math.round(Math.round(toLowRes * data[i + 0]) * toHiRes);
                data[i + 1] = Math.round(Math.round(toLowRes * data[i + 1]) * toHiRes);
                data[i + 2] = Math.round(Math.round(toLowRes * data[i + 2]) * toHiRes);
            }
        }
        return true;
    }
};
