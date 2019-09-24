<!--
/**
 |--------------------------
 | EnzoClickSpot
 |--------------------------
 | Creates an invisible circle which has hover and click events.
 |
 | If a slot is present, this uses that slot's contents instead of a circle.
 |
 | Emits a `click` event.
 |
 | Development tools can make the spots visible.
 */
-->
<template>
    <easel-container
        :x="x"
        :y="y"
        :alpha="alpha"
        cursor="pointer"
        :cache="true"
        @click="$emit('click', $event)"
        @rollover="hover"
        @rollout="unhover"
    >
        <slot>
            <easel-shape
                form="circle"
                :dimensions="r"
                fill="black"
                align="center-center"
            >
            </easel-shape>
        </slot>
    </easel-container>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';
import DevSettings from '@develop/DevSettings.js';

export default {
    mixins: [UsesTextLayer],
    props: [
        'x',
        'y',
        'r',
        'name',
    ],
    computed: {
        alpha() {
            return DevSettings.showClickSpots ? 0.5 : 0.01;
        },
    },
};
</script>
