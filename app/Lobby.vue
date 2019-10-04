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
            x="326"
            y="70"
            r="25"
            @click="queueMessage('The town looks dark tonight.', 326, 70)"
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
            :key="book.id"
            v-bind="book"
            :name="app.world.collections.bargain[book.id]"
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
        this.app.world.collections.bargain.load();
        const books = [
            ['book1', 252, 203, 11],
            ['book2', 278, 200, 10],
            ['book3', 304, 200, 10],
            ['book4', 330, 193, 10],
            ['book5', 256, 224, 11],
            ['book6', 286, 223, 11],
            ['book7', 272, 213, 11],
            ['book8', 311, 213, 11],
            ['book9', 328, 214, 11],
            ['book10', 315, 225, 7],
            ['book11', 342, 205, 7],
            ['book12', 345, 223, 7],
        ].forEach(([id, x, y, r]) => { return {id, x, y, r} });
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
            this.plant.response = "Hasn't this plant been through enough?";
            this.plant.ruffled = true;
        },
    },
};
</script>
