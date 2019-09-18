<template>
    <easel-shape
        form="circle"
        :x="x"
        :y="y"
        :dimensions="r"
        fill="black"
        alpha=".01"
        align="center-center"
        @click="$emit('click', $event)"
        @mouseover="hover"
        @mouseout="unhover"
    >
    </easel-shape>
</template>

<script>
import UsesTextLayer from '@mixins/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    props: [
        'x',
        'y',
        'r',
        'name',
    ],
};
</script>
