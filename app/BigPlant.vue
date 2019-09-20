<template>
    <easel-sprite-sheet
        :images="['./big-plant-in-lobby-sprite.gif']"
        :frames="{width: 90, height: 96}"
        :animations="{
            rest: 1,
            rustleAndRest: {
                frames: [3, 0, 3, 1],
                next: 'ruffled',
            },
            ruffled: 3,
        }"
        :framerate="5"
    >
        <easel-sprite
            :x="x"
            :y="y"
            :animation="animation || restFrame"
            align="bottom-center"
            cursor="pointer"
            @click="shakePlant"
            @animationend="restPlant"
            @mouseover="hover"
            @mouseout="unhover"
        >
        </easel-sprite>
    </easel-sprite-sheet>
</template>

<script>
import UsesTextLayer from '@mixins/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    props: ['x', 'y', 'name', 'ruffled'],
    data() {
        return {
            animation: null,
        };
    },
    computed: {
        restFrame() {
            return this.ruffled ? 'ruffled' : 'rest';
        },
    },
    methods: {
        shakePlant() {
            this.animation = 'rustleAndRest';
        },
        restPlant() {
            if (this.animation === 'rustleAndRest') {
                this.animation = null;
                this.$emit('shake', this);
            }
        },
    },
};
</script>
