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
        :align="arrayAlign || autoAlign"
        :color="color || 'yellow'"
        :font="`${fontWidth}px 'Press Start 2P'`"
        :filters="[['PixelStrokeFilter', [], strokeSize, {antiAlias: false}]]"
    >
    </easel-text>
</template>

<script>
import sizeText from '@libs/sizeText.js';

export default {
    inject: ['app'],
    props: [
        'text',
        'x',
        'y',
        'buffer',
        'align',
        'color',
    ],
    data() {
        return {
            fontWidth: 8,
        };
    },
    computed: {
        arrayAlign() {
            if (this.align instanceof Array) {
                return this.align;
            } else if (this.align) {
                return new String(this.align).split(/\-/);
            } else {
                return null;
            }
        },
        autoAlign() {
            const horizontal = this.x < this.app.viewport.width / 2
                ? 'left'
                : 'right';
            const vertical = this.y < this.app.viewport.height / 2
                ? 'top'
                : 'bottom';
            return [horizontal, vertical];
        },
        shiftedX() {
            const align = this.arrayAlign || this.autoAlign;
            return parseInt(this.x) + (this.buffer || 0) * (align.includes('left') ? 1 : -1);
        },
        shiftedY() {
            const align = this.arrayAlign || this.autoAlign;
            return parseInt(this.y) + (this.buffer || 0) * (align.includes('top') ? 1 : -1);
        },
        maxPixelWidth() {
            const align = this.arrayAlign || this.autoAlign;
            return align.includes('left')
                ? this.app.viewport.width - this.shiftedX
                : this.shiftedX;
        },
        fittedText() {
            const maxLength = this.maxPixelWidth / this.fontWidth;
            return sizeText(this.text, maxLength);
        },
        strokeSize() {
            return 2 * window.devicePixelRatio;
        },
    },
};
</script>
