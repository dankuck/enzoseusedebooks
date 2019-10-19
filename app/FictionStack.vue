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
    <easel-container :visible="loaded">
        <easel-bitmap
            image="bookcase2-back.gif"
        >
        </easel-bitmap>

        <stack
            :collection="app.world.collections.fiction"
            :shelves="[
                [10, 300, 66, 69],
                [11, 349, 118, 118],
                [40, 349, 169, 162],
                [13, 349, 214, 209],
                [14, 349, 260, 255],
            ]"
            :hide-books="[viewBook]"
            @clickBook="selectBook"
            @loaded="loaded = true"
        >
        </stack>

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
import Stack from '@app/Stack';
import HasTextLayer from '@textLayer/HasTextLayer';
import BookViewer from '@app/BookViewer';

export default {
    mixins: [HasTextLayer],
    components: {
        Stack,
        BookViewer,
    },
    inject: ['app'],
    data() {
        return {
            viewBook: null,
            loaded: false,
        };
    },
    computed: {
    },
    methods: {
        selectBook(book) {
            this.viewBook = book;
        },
    },
};
</script>
