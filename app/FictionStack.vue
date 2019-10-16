<!--
/**
 |---------------------------------
 | FictionStack
 |---------------------------------
 | This component is a visual context.
 |
 | It provides TextLayer tools, shows a GIF background, and has click spots for
 | emitting events up to EnzosEusedEbooks.
 */
-->

<template>
    <easel-container>
        <easel-bitmap
            image="bookcase2-back.gif"
        >
        </easel-bitmap>

        <template
            v-for="(shelf, shelfIndex) in shelves"
        >
            <easel-shape
                v-for="(book, bookIndex) in shelf"
                :key="shelfIndex + ':' + bookIndex"
                form="rect"
                v-bind="book"
                stroke="#351601"
                align="bottom-left"
            >
            </easel-shape>
        </template>

        <easel-bitmap
            image="bookcase2-front.gif"
        >
        </easel-bitmap>

        <enzo-click-spot
            name="Lobby"
            x="5"
            y="150"
            @click="goTo('lobby')"
        >
            <easel-shape
                form="rect"
                x="-5"
                y="-150"
                :dimensions="[7, 300]"
                fill="black"
            >
            </easel-shape>
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
import HasTextLayer from '@textLayer/HasTextLayer';
import BookViewer from '@app/BookViewer';

export default {
    mixins: [HasTextLayer],
    components: {
        BookViewer,
    },
    data() {
        // this.app.world.collections.fiction.load();
        return {
            viewBook: null,
        };
    },
    computed: {
        shelves() {
            return [
                this.buildBookList(9, 300, 67, 69),
                this.buildBookList(11, 349, 119, 119),
                this.buildBookList(40, 349, 171, 164),
                this.buildBookList(13, 349, 216, 211),
                this.buildBookList(14, 349, 260, 255),
            ];
        },
    },
    methods: {
        buildBookList(minX, maxX, minY, maxY) {
            const books = [];
            const colors = [
                '#dd971f',
                '#d5ae57',
                '#dfc290',
                '#151580',
                '#b93109',
            ];
            const slope = (maxY - minY) / (maxX - minX);
            for (let x = minX; x < maxX;) {
                const width = 10 + Math.floor(Math.random() * 10);
                const height = 30 + Math.floor(Math.random() * 10);
                const book = {
                    fill: colors[Math.floor(Math.random() * colors.length)],
                    dimensions: [width, height],
                    x,
                    y: minY + slope * (x - minX),
                };
                books.push(book);
                x += book.dimensions[0];
            }
            return books;
        },
        goTo(where) {
            if (where) {
                this.app.world.location = where;
            }
        },
    },
};
</script>
