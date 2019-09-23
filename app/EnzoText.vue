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
        :text="text"
        :x="shiftedX"
        :y="shiftedY"
        :align="align"
        color="white"
        :shadow="['#CCF', 1, 1, 1]"
        font="7px 'Press Start 2P'"
    >
    </easel-text>
</template>

<script>
export default {
    inject: ['app'],
    props: [
        'text',
        'x',
        'y',
        'buffer',
    ],
    computed: {
        align() {
            const horizontal = this.x < this.app.canvas.pixelWidth / 2
                ? 'left'
                : 'right';
            const vertical = this.y < this.app.canvas.pixelHeight / 2
                ? 'top'
                : 'bottom';
            return [horizontal, vertical];
        },
        shiftedX() {
            return parseInt(this.x) + (this.buffer || 0) * (this.align[0] === 'left' ? 1 : -1);
        },
        shiftedY() {
            return parseInt(this.y) + (this.buffer || 0) * (this.align[1] === 'top' ? 1 : -1);
        },
    },
};
</script>
