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
            name="Angry Plant"
        >
        </big-plant>
        <text-layer :messager="messager" :hoverer="hoverer"></text-layer>
    </easel-container>
</template>

<script>
import BigPlant from './BigPlant';
import HasTextLayer from './mixins/HasTextLayer';

export default {
    mixins: [HasTextLayer],
    components: {
        BigPlant,
    },
    data() {
        return {
            plant: {
                animation: 'rest',
            },
        };
    },
    methods: {
        checkPlant() {
            this.messager.queue({
                text: 'The plant is messy now',
                x: 330,
                y: 100,
            });
        },
    },
};
</script>
