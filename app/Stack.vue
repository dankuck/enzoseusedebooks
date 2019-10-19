<!--
/**
 |---------------------------------
 | Stack
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
            :image="background"
        >
        </easel-bitmap>

        <stack-book
            v-for="book in booksRandomized"
            v-if="book.book != viewBook"
            :key="'book:' + book.bookCode"
            v-bind="book"
            @click="viewBook = book.book"
        >
        </stack-book>

        <easel-bitmap
            :image="foreground"
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
import shuffle from 'lodash.shuffle';

export default {
    mixins: [HasTextLayer],
    props: [
        'background',
        'foreground',
        'collection',
        'shelves',
    ],
    components: {
        BookViewer,
        StackBook,
    },
    mounted() {
        this.collection.load()
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
            const bookCodes = [...this.collection.codes];
            return this.shelves.reduce((books, shelf) => {
                return books.concat(this.buildBookList(...shelf, bookCodes))
            }, []);
        },
        booksRandomized() {
            return shuffle(this.books);
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
            for (let x = minX; x < maxX && bookCodes.length > 0;) {
                const bookCode = bookCodes.shift();
                const book = this.collection[bookCode];
                const {width, height} = this.getDimensions(book);
                books.push({
                    color: colors[book.title.length % colors.length],
                    width,
                    height,
                    x,
                    y: Math.round(minY + slope * (x - minX)),
                    book,
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
