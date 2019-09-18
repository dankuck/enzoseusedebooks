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
        <enzo-click-spot
            v-for="book in books"
            :key="book.name"
            v-bind="book"
        >
        </enzo-click-spot>
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
            books: [
                {
                    x: 252,
                    y: 203,
                    r: 11,
                    name: "Blue Book",
                },
                {
                    x: 278,
                    y: 200,
                    r: 10,
                    name: "Red Book",
                },
                {
                    x: 304,
                    y: 200,
                    r: 10,
                    name: "Open Book",
                },
                {
                    x: 330,
                    y: 193,
                    r: 10,
                    name: "Tan Book",
                },
            ],
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
