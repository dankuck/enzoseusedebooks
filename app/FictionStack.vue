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
    <easel-container
        v-if="loaded"
    >
        <easel-bitmap
            image="bookcase2-back.gif"
        >
        </easel-bitmap>

        <stack-book
            v-for="book in books"
            v-if="book.book != viewBook"
            :key="'book:' + book.bookCode"
            v-bind="book"
            @click="viewBook = book.book"
        >
        </stack-book>

        <easel-bitmap
            image="bookcase2-front.gif"
        >
        </easel-bitmap>

        <enzo-click-spot
            name="Lobby"
            x="5"
            y="150"
            @click="app.world.goTo('lobby')"
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
import StackBook from '@app/StackBook';

export default {
    mixins: [HasTextLayer],
    components: {
        BookViewer,
        StackBook,
    },
    mounted() {
        this.app.world.collections.fiction.load()
            .then(() => this.loaded = true);
    },
    data() {
        return {
            viewBook: null,
            loaded: false,
        };
    },
    computed: {
        books() {
            const bookCodes = [...this.app.world.collections.fiction.codes];
            return []
                .concat(this.buildBookList(10, 300, 67, 69, bookCodes))
                .concat(this.buildBookList(11, 349, 119, 119, bookCodes))
                .concat(this.buildBookList(40, 349, 171, 164, bookCodes))
                .concat(this.buildBookList(13, 349, 216, 211, bookCodes))
                .concat(this.buildBookList(14, 349, 260, 255, bookCodes))
        },
    },
    methods: {
        buildBookList(minX, maxX, minY, maxY, bookCodes) {
            const books = [];
            const colors = [
                '#dd971f',
                '#d5ae57',
                '#dfc290',
                '#151580',
                '#b93109',
            ];
            const slope = (maxY - minY) / (maxX - minX);
            const pixelsPerInch = 10;
            for (let x = minX; x < maxX && bookCodes.length > 0;) {
                const bookCode = bookCodes.shift();
                const bookData = this.app.world.collections.fiction[bookCode];
                const {width, height} = this.getDimensions(bookData);
                books.push({
                    color: colors[bookData.title.length % colors.length],
                    width,
                    height,
                    x,
                    y: Math.round(minY + slope * (x - minX)),
                    book: bookData,
                    bookCode,
                });
                x += width;
            }
            return books;
        },
        getDimensions(bookData) {
            if (!bookData.dimensions) {
                return {width: 5, height: 30};
            } else {
                let realWidth = bookData.dimensions.width;
                let realHeight = bookData.dimensions.height;
                if (realWidth > realHeight) { // somebody did these backwards
                    [realWidth, realHeight] = [realHeight, realWidth];
                }
                const width = realWidth <= .5
                    ? 10
                    : realWidth <= 1
                    ? 12
                    : 15;
                const height = realHeight <= 8
                    ? 30
                    : realHeight <= 10
                    ? 35
                    : 40;
                return {width, height};
            }
        },
    },
};
</script>
