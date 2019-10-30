<template>
    <easel-container
        :x="x + size / 2"
        :y="y + size / 2"
        @mouseover="hover"
        @mouseout="unhover"
        cursor="pointer"
    >
        <easel-shape
            form="rect"
            fill="black"
            :dimensions="[size, size]"
            align="center-center"
        >
        </easel-shape>

        <easel-bitmap
            :image="image"
            align="center-center"
        >
        </easel-bitmap>
    </easel-container>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    props: ['x', 'y', 'size', 'name', 'image'],
};
</script>
