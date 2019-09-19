<template>
    <easel-container>
        <easel-bitmap
            image="lobby.gif"
        >
        </easel-bitmap>
        <enzo-click-spot
            name="Window"
            x="321"
            y="75"
            r="20"
        >
        </enzo-click-spot>
        <enzo-click-spot
            v-for="(aisle, aisleIndex) in aisles"
            :key="'aisle:' + aisleIndex"
            v-bind="aisle"
        >
            <easel-shape
                v-for="(dimensions, index) in aisle.dimensionSets"
                :key="'aisleShape:' + aisleIndex + ':' + index"
                :form="dimensions[0]"
                :x="dimensions[1]"
                :y="dimensions[2]"
                :dimensions="dimensions[3]"
                fill="black"
            >
            </easel-shape>
        </enzo-click-spot>
        <big-plant
            :name="plant.name"
            x="330"
            y="160"
            @shake="checkPlant"
        >
        </big-plant>
        <enzo-click-spot
            v-for="(book, index) in books"
            :key="'book:' + index"
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
                name: 'Suspicious Plant',
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
                {
                    x: 256,
                    y: 224,
                    r: 11,
                    name: "Tan Book",
                },
                {
                    x: 286,
                    y: 223,
                    r: 11,
                    name: "Brown Book",
                },
                {
                    x: 272,
                    y: 213,
                    r: 11,
                    name: "Yellow Book",
                },
                {
                    x: 311,
                    y: 213,
                    r: 11,
                    name: "Brown Book",
                },
                {
                    x: 328,
                    y: 214,
                    r: 11,
                    name: "Blue Book",
                },
                {
                    x: 315,
                    y: 225,
                    r: 7,
                    name: "Red Book",
                },
                {
                    x: 342,
                    y: 205,
                    r: 7,
                    name: "Tan Book",
                },
                {
                    x: 345,
                    y: 223,
                    r: 7,
                    name: "Red Book",
                },
            ],
            aisles: [
                {
                    x: 197 + 20,
                    y: 53 + 42,
                    dimensionSets: [
                        ['rect', -20, -42, [40, 84]],
                    ],
                    name: "Old Books",
                },
                {
                    x: 118,
                    y: 87,
                    dimensionSets: [
                        ['rect', -23, -37, [46, 84]],
                    ],
                    name: "Musty Books",
                },
                {
                    x: 37,
                    y: 97,
                    dimensionSets: [
                        ['rect', -18, -39, [36, 78]],
                    ],
                    name: "Ratty Books",
                },
                {
                    x: 295,
                    y: 64,
                    dimensionSets: [
                        ['rect', -6, -25, [12, 50]],
                        ['rect', -12, 28, [17, 46]],
                    ],
                    name: "Shadowy Area",
                },
                {
                    x: 0,
                    y: 168,
                    dimensionSets: [
                        ['ellipse', 23, 0, [108, 54]],
                        ['rect', 0, 0, [70, 90]],
                        ['rect', 0, 36, [127, 55]],
                    ],
                    name: "Shabby Desk",
                },
            ],
        };
    },
    methods: {
        checkPlant(plant) {
            this.plant.name = 'Ruffled Plant';
            this.showMessage({
                text: "You ruffled the plant.\nIt's messy now.",
                x: plant.x,
                y: plant.y,
            });
        },
    },
};
</script>
