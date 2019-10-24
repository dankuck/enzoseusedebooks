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
            @click="aisle.click"
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
            :name="this.app.world.lobbyPlant.name"
            x="330"
            y="160"
            :ruffled="this.app.world.lobbyPlant.ruffled"
            @shake="checkPlant"
        >
        </big-plant>

        <enzo-click-spot
            v-for="book in books"
            :key="book.id"
            v-bind="book"
            :name="book.book.title"
            @click="viewBook = book.book"
        >
        </enzo-click-spot>

        <book-viewer
            v-if="viewBook"
            :book="viewBook"
            @close="viewBook = null"
        >
        </book-viewer>

        <text-layer
            v-else
        >
        </text-layer>
    </easel-container>
</template>

<script>
import BigPlant from '@app/BigPlant';
import HasTextLayer from '@textLayer/HasTextLayer';
import BookViewer from '@app/BookViewer';

export default {
    mixins: [HasTextLayer],
    components: {
        BigPlant,
        BookViewer,
    },
    data() {
        this.app.world.collections.bargain.load();
        return {
            viewBook: null,
        };
    },
    computed: {
        books() {
            return [
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
            ].map(([id, x, y, r]) => {
                const book = this.app.world.collections.bargain[id];
                return {id, x, y, r, book};
            });
        },
        aisles() {
            return [
                {
                    x: 197 + 20,
                    y: 53 + 42,
                    dimensionSets: [
                        ['rect', -20, -42, [40, 84]],
                    ],
                    name: this.app.world.hasGoneTo('children-stack')
                        ? 'Musty Children\'s Books'
                        : 'Musty Books',
                    click: () => this.app.world.goTo('children-stack'),
                },
                {
                    x: 118,
                    y: 87,
                    dimensionSets: [
                        ['rect', -23, -37, [46, 84]],
                    ],
                    name: this.app.world.hasGoneTo('fiction-stack')
                        ? 'Crusty Fiction'
                        : 'Crusty Books',
                    click: () => this.app.world.goTo('fiction-stack'),
                },
                {
                    x: 37,
                    y: 97,
                    dimensionSets: [
                        ['rect', -18, -39, [36, 78]],
                    ],
                    name: this.app.world.hasGoneTo('nonfiction-stack')
                        ? 'Dusty Non-Fiction'
                        : 'Dusty Books',
                    click: () => this.app.world.goTo('nonfiction-stack'),
                },
                {
                    x: 295,
                    y: 64,
                    dimensionSets: [
                        ['rect', -6, -25, [12, 50]],
                        ['rect', -12, 28, [17, 46]],
                    ],
                    name: "Shadowy Area",
                    click: () => this.showMessage("There's nothing in the shadowy area, yet.", 295, 64),
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
                    click: () => this.showMessage("The desk is empty right now.", 0, 168),
                },
            ];
        },
    },
    methods: {
        checkPlant(vuePlant) {
            this.showMessage(this.app.world.lobbyPlant.response, vuePlant.x, vuePlant.y);
            this.app.world.ruffleLobbyPlant();
        },
    },
};
</script>
