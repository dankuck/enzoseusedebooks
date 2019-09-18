<template>
    <easel-container>
        <easel-bitmap
            image="lobby.gif"
        >
        </easel-bitmap>
        <big-plant
            name="Suspicious Plant"
            x="330"
            y="160"
            @shake="checkPlant"
        >
        </big-plant>
        <text-layer v-bind="textLayer"></text-layer>
    </easel-container>
</template>

<script>
import BigPlant from '@app/BigPlant';
import HasTextLayer from '@mixins/HasTextLayer';

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
        checkPlant(plant) {
            this.showMessage({
                text: "You ruffled the plant.\nIt's messy now.",
                x: plant.x,
                y: plant.y,
            });
        },
    },
};
</script>
