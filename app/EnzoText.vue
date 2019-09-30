<!--
/**
 |--------------------------
 | EnzoText
 |--------------------------
 | Displays text using an <easel-text> in a default style, while shifting the
 | location and alignment depending on the location on the canvas, to increase
 | readability.
 */
-->
<template>
    <easel-text
        :text="fittedText"
        :x="shiftedX"
        :y="shiftedY"
        :align="align"
        color="white"
        :shadow="['#CCF', 1, 1, 1]"
        :font="`${fontWidth}px 'Press Start 2P'`"
    >
    </easel-text>
</template>

<script>
import sizeText from '@libs/sizeText.js'

export default {
    inject: ['app'],
    props: [
        'text',
        'x',
        'y',
        'buffer',
    ],
    data() {
        return {
            fontWidth: 8,
        };
    },
    computed: {
        align() {
            const horizontal = this.x < this.app.canvas.pixelWidth / 2
                ? 'left'
                : 'right';
            const vertical = this.y < this.app.canvas.pixelHeight / 2
                ? 'top'
                : 'alphabetic';
            console.log(this.y, this.app.canvas.pixelHeight / 2, vertical);
            return [horizontal, vertical];
        },
        shiftedX() {
            return parseInt(this.x) + (this.buffer || 0) * (this.align[0] === 'left' ? 1 : -1);
        },
        shiftedY() {
            return parseInt(this.y) + (this.buffer || 0) * (this.align[1] === 'top' ? 1 : -1);
        },
        fittedText() {
            const maxLength = (this.app.canvas.pixelWidth / 2) / this.fontWidth;
            return sizeText(this.text, maxLength);
        },
    },
};
</script>
