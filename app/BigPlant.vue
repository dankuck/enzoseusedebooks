<template>
    <easel-sprite-sheet
        :images="['./big-plant-in-lobby-sprite.gif']"
        :frames="{width: 90, height: 96}"
        :animations="{
            rest: 1,
            rustleAndRest: {
                frames: [3, 0],
                next: 'rest',
            },
        }"
        :framerate="4"
    >
        <easel-sprite
            :x="x"
            :y="y"
            :animation="animation"
            align="bottom-center"
            @click="shakePlant"
            @animationend="restPlant"
        >
        </easel-sprite>
    </easel-sprite-sheet>
</template>

<script>
export default {
    props: ['x', 'y'],
    data() {
        return {
            animation: 'rest',
        };
    },
    methods: {
        shakePlant() {
            this.animation = 'rustleAndRest';
        },
        restPlant() {
            if (this.animation !== 'rest') {
                this.animation = 'rest';
                this.$emit('shake');
            }
        },
    },
};
</script>
