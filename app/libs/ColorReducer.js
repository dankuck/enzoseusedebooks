
export default class ColorReducer {

    constructor(colorsPerChannel) {
        this.colorsPerChannel = colorsPerChannel;
    }

    adjustImageData(imageData) {
        const data = imageData.data;
        const length = data.length;
        const segments = this.colorsPerChannel - 1;
        for (let i = 0; i < length; i += 4) {
            if (data[i + 3] > 0) {
                data[i + 0] = Math.round(Math.round(segments * data[i + 0] / 255) * 255 / segments);
                data[i + 1] = Math.round(Math.round(segments * data[i + 1] / 255) * 255 / segments);
                data[i + 2] = Math.round(Math.round(segments * data[i + 2] / 255) * 255 / segments);
            }
        }
        return true;
    }
};
