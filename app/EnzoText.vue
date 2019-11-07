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
        :align="align || autoAlign"
        :color="color || 'yellow'"
        :font="`${fontWidth}px 'Press Start 2P'`"
        :filters="[['PixelStrokeFilter', [], strokeSize, {antiAlias: false}]]"
        :cursor="cursor || null"
        @click="$emit('click', $event)"
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
        'cursor',
    ],
    data() {
        return {
            fontWidth: 8,
        };
    },
    computed: {
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
            if (this.align) {
                return this.x;
            } else {
                return parseInt(this.x) + (this.buffer || 0) * (this.autoAlign[0] === 'left' ? 1 : -1);
            }
        },
        shiftedY() {
            if (this.align) {
                return this.y;
            } else {
                return parseInt(this.y) + (this.buffer || 0) * (this.autoAlign[1] === 'top' ? 1 : -1);
            }
        },
        fittedText() {
            const maxLength = (this.app.viewport.width / 2) / this.fontWidth;
            return sizeText(this.text, maxLength);
        },
        strokeSize() {
            return 2 * window.devicePixelRatio;
        },
    },
};
</script>
