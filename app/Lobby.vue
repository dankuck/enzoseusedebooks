<template>
    <easel-container>
        <easel-bitmap
            image="lobby.gif"
        >
        </easel-bitmap>
        <big-plant
            x="330"
            y="160"
            @shake="checkPlant"
        >
        </big-plant>
        <enzo-text
            text="The plant is messy now"
            x="330"
            y="100"
            align="bottom-right"
            v-if="showMessage"
        >
        </enzo-text>
    </easel-container>
</template>

<script>
import BigPlant from './BigPlant';
export default {
    components: {
        BigPlant,
    },
    data() {
        return {
            showMessage: false,
            plant: {
                animation: 'rest',
            },
        };
    },
    methods: {
        checkPlant() {
            this.showMessage = true;
            setTimeout(() => this.showMessage = false, 2000);
        },
    },
};
</script>
