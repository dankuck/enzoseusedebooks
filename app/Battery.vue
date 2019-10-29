<template>
    <easel-bitmap
        image="images/battery.gif"
        :x="x"
        :y="y"
        @mouseover="hover"
        @mouseout="unhover"
        cursor="pointer"
    >
    </easel-bitmap>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    inject: ['app'],
    props: ['x', 'y'],
    data() {
        return {
            name: 'AA Battery',
        };
    },
};
</script>
