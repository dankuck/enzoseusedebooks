<!--
/**
 |---------------------------------
 | Lobby
 |---------------------------------
 | This component is the first visual context a user is brought to.
 |
 | It provides TextLayer tools, shows a GIF background, and has click spots for
 | emitting events up to EnzosEusedEbooks.
 */
-->

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
            :ruffled="plant.ruffled"
            @shake="checkPlant"
        >
        </big-plant>
        <enzo-click-spot
            v-for="(book, index) in books"
            :key="'book:' + index"
            v-bind="book"
        >
        </enzo-click-spot>
        <text-layer></text-layer>
    </easel-container>
</template>

<script>
import BigPlant from '@app/BigPlant';
import HasTextLayer from '@textLayer/HasTextLayer';

export default {
    mixins: [HasTextLayer],
    components: {
        BigPlant,
    },
    data() {
        const books = [];
        [
            {
                x: 252,
                y: 203,
                r: 11,
                id: 'bargain-1',
            },
            {
                x: 278,
                y: 200,
                r: 10,
                id: 'bargain-2',
            },
            {
                x: 304,
                y: 200,
                r: 10,
                id: 'bargain-3',
            },
            {
                x: 330,
                y: 193,
                r: 10,
                id: 'bargain-4',
            },
            {
                x: 256,
                y: 224,
                r: 11,
                id: 'bargain-5',
            },
            {
                x: 286,
                y: 223,
                r: 11,
                id: 'bargain-6',
            },
            {
                x: 272,
                y: 213,
                r: 11,
                id: 'bargain-7',
            },
            {
                x: 311,
                y: 213,
                r: 11,
                id: 'bargain-8',
            },
            {
                x: 328,
                y: 214,
                r: 11,
                id: 'bargain-9',
            },
            {
                x: 315,
                y: 225,
                r: 7,
                id: 'bargain-10',
            },
            {
                x: 342,
                y: 205,
                r: 7,
                id: 'bargain-11',
            },
            {
                x: 345,
                y: 223,
                r: 7,
                id: 'bargain-12',
            },
        ].forEach(spot => {
            this.app.world.chooseNameFromCollection(spot.id, 'bargain')
                .then(name => {
                    spot.name = name;
                    books.push(spot);
                });
        });
        return {
            books,
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
    computed: {
        plant() {
            return this.app.world.lobbyPlant;
        },
    },
    methods: {
        checkPlant(vuePlant) {
            this.showMessage(this.plant.response, vuePlant.x, vuePlant.y);
            this.plant.name = 'Ruffled Plant';
            this.plant.response = "Hasn't this plant been\nthrough enough?";
            this.plant.ruffled = true;
        },
    },
};
</script>
