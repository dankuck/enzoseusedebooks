<template>
    <easel-text
        :text="text"
        :x="x"
        :y="y"
        :align="align"
        color="white"
        :shadow="['#CCF', 1, 1, 1]"
        font="10px 'Press Start 2P'"
    >
    </easel-text>
</template>

<script>
import {pixelWidth, pixelHeight} from '@app/EnzosEusedEbooks';

export default {
    props: [
        'text',
        'x',
        'y',
    ],
    computed: {
        align() {
            const horizontal = this.x < pixelWidth / 2
                ? 'left'
                : 'right';
            const vertical = this.y < pixelHeight / 2
                ? 'top'
                : 'bottom';
            return [horizontal, vertical];
        },
    },
};
</script>
