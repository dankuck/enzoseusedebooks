<template>
    <easel-container>
        <easel-shape
            form="rect"
            :x="x"
            :y="y"
            :dimensions="[width, height]"
            :fill="color"
            stroke="#351601"
            align="bottom-left"
            cursor="pointer"
            @mouseover="hover"
            @mouseout="unhover"
            @click="$emit('click', $event)"
        >
        </easel-shape>
    </easel-container>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    props: [
        'book',
        'color',
        'width',
        'height',
        'x',
        'y',
    ],
    computed: {
        hoverName() {
            return this.book.title;
        },
        hoverX() {
            return this.x + this.width / 2;
        },
        hoverY() {
            return this.y - this.height;
        },
    },
};
</script>
