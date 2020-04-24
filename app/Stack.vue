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
    <easel-container>

        <stack-book
            v-for="book in booksRandomized"
            v-if="!hideBooks.includes(book.book)"
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
    props: {
        collection: {
            required: true,
        },
        shelves: {
            required: true,
        },
        align: {
            default: 'left',
        },
        hideBooks: {
            default: () => { return [] },
        },
    },
    components: {
        StackBook,
    },
    mounted() {
        this.collection.load()
            .finally(() => this.$emit('loaded'));
    },
    data() {
        return {
        };
    },
    computed: {
        books() {
            const bookCodes = [...this.collection.codes];
            return this.shelves.reduce((books, shelf) => {
                return books.concat(this.buildBookList(...shelf, bookCodes))
            }, []);
        },
        /**
         * The randomization will not make the books show in random places,
         * but it will cause them to be added randomly, and that will cause
         * the auto-hover to jump around.
         * @return {array}
         */
        booksRandomized() {
            return shuffle(this.books);
        },
    },
    methods: {
        /**
         * Given pixel dimensions of a shelf, get as many books to fit on it
         * as possible. Give each book an arbitrary color and other features.
         * @param  {int} minX
         * @param  {int} maxX
         * @param  {int} minY
         * @param  {int} maxY
         * @param  {array} bookCodes
         * @return {array}
         */
        buildBookList(minX, maxX, minY, maxY, bookCodes) {
            const colors = [
                '#dd971f',
                '#d5ae57',
                '#dfc290',
                '#151580',
                '#b93109',
            ];
            const codes = this.takeBookCodes(maxX - minX, bookCodes);
            const books = codes
                .map(bookCode => {
                    const book = this.collection[bookCode];
                    if (!book.title) {
                        return null;
                    }
                    const {width, height} = this.getDimensions(book);
                    return {
                        bookCode,
                        book,
                        width,
                        height,
                        color: colors[book.title.length % colors.length],
                    };
                })
                .filter(Boolean);
            return this.positionBooks(books, minX, maxX, minY, maxY);
        },
        takeBookCodes(maxWidth, bookCodes) {
            let i = 0;
            let totalWidth = 0;
            for (; i < bookCodes.length; i++) {
                const {width} = this.getDimensions(this.collection[bookCodes[i]]);
                if (totalWidth + width < maxWidth) {
                    totalWidth += width;
                } else {
                    break;
                }
            }
            return bookCodes.splice(0, i);
        },
        positionBooks(books, minX, maxX, minY, maxY) {
            const slope = (maxY - minY) / (maxX - minX);
            let [sizer, x] = this.align === 'left'
                ? [
                    entry => {
                        entry.x = x;
                        entry.y = Math.round(minY + slope * (x - minX));
                        x += entry.width;
                    },
                    minX
                ]
                : [
                    entry => {
                        x -= entry.width;
                        entry.x = x;
                        entry.y = Math.round(minY + slope * (x - minX));
                    },
                    maxX
                ];
            books.forEach(sizer);
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
