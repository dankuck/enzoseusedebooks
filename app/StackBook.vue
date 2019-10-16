<template>
    <easel-container>
        <easel-shape
            form="rect"
            v-bind="book"
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
    props: ['book'],
    computed: {
        hoverName() {
            return this.book.book.title;
        },
        hoverX() {
            return this.book.x + this.book.dimensions[0] / 2;
        },
        hoverY() {
            return this.book.y - this.book.dimensions[1];
        },
    },
};
</script>
