<template>
    <easel-container>
        <easel-bitmap
            image="lobby.gif"
        >
        </easel-bitmap>
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
                :animation="plant.animation"
                align="bottom-center"
                x="330"
                y="160"
                @click="shakePlant"
                @animationend="restPlant"
            >
            </easel-sprite>
        </easel-sprite-sheet>
        <enzo-text
            text="The plant is messy now"
            x="330"
            y="60"
            align="bottom-right"
            v-if="showMessage"
        >
        </enzo-text>
    </easel-container>
</template>

<script>
export default {
    data() {
        return {
            showMessage: false,
            plant: {
                animation: 'rest',
            },
        };
    },
    methods: {
        shakePlant() {
            this.plant.animation = 'rustleAndRest';
        },
        restPlant() {
            if (this.plant.animation !== 'rest') {
                this.plant.animation = 'rest';
                this.showMessage = true;
                setTimeout(() => this.showMessage = false, 2000);
            }
        },
    },
};
</script>
