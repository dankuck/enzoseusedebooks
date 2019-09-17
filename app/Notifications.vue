<template>
    <enzo-text
        v-if="messager.message"
        :text="messager.message.text"
        :x="messager.message.x"
        :y="messager.message.y"
        :align="align(messager.message)"
    >
    </enzo-text>
</template>

<script>
import Messager from './libs/Messager';
import {pixelWidth, pixelHeight} from './EnzosEusedEbooks';

const messager = new Messager(2000);

export default {
    clear() {
        return messager.clear();
    },
    queue(notification) {
        return messager.queue(notification);
    },
    data() {
        return {
            messager,
        };
    },
    methods: {
        align({x, y}) {
            const horizontal = x < pixelWidth / 2
                ? 'left'
                : 'right';
            const vertical = y < pixelHeight / 2
                ? 'top'
                : 'bottom';
            return [horizontal, vertical];
        },
    },
};
</script>
