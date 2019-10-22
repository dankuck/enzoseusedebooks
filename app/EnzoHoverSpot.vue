<!--
/**
 |--------------------------
 | EnzoHoverSpot
 |--------------------------
 | Creates an invisible circle which emits at a given speed when its being
 | hovered over.
 |
 | If a slot is present, this uses that slot's contents instead of a circle.
 |
 | Emits a `hovering` event continuously until unhovered.
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
        @rollover="beginHover"
        @rollout="endHover"
        @mousedown="beginHover"
        @pressup="endHover"
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
import DevSettings from '@develop/DevSettings.js';

export default {
    props: [
        'x',
        'y',
        'r',
        'speed',
    ],
    data() {
        return {
            hovering: null,
        };
    },
    destroyed() {
        this.endHover();
    },
    computed: {
        alpha() {
            return DevSettings.showClickSpots ? 0.5 : 0.01;
        },
    },
    methods: {
        beginHover() {
            if (this.hovering) {
                clearInterval(this.hovering);
            }
            this.hovering = setInterval(() => this.$emit('hovering'), 1000 / this.speed);
            this.$emit('hovering');
        },
        endHover() {
            if (!this.hovering) {
                return;
            }
            clearInterval(this.hovering);
            this.hovering = null;
        },
    },
};
</script>
