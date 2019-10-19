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

        <stack-book
            v-for="book in booksRandomized"
            v-if="book.book != viewBook && book.book.title"
            :key="'book:' + book.bookCode"
            v-bind="book"
            @click="$emit('clickBook', book.book)"
        >
        </stack-book>

    </easel-container>
</template>

<script>
import StackBook from '@app/StackBook';
import shuffle from 'lodash.shuffle';

export default {
    props: [
        'collection',
        'shelves',
    ],
    components: {
        StackBook,
    },
    mounted() {
        this.collection.load()
            .finally(() => this.loaded = true);
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
