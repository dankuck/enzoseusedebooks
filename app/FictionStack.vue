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
        <sliding-window
            width="400"
            start-x="10"
        >
            <easel-bitmap
                image="images/bookcase2-back.gif"
            >
            </easel-bitmap>

            <stack
                :collection="app.world.collections.fiction"
                :shelves="[
                    [10 + 25, 300 + 25, 66, 69],
                    [11 + 25, 349 + 25, 118, 118],
                    [40 + 25, 349 + 25, 169, 162],
                    [13 + 25, 349 + 25, 214, 209],
                    [14 + 25, 349 + 25, 260, 255],
                ]"
                :hide-books="[viewBook]"
                @clickBook="selectBook"
                @loaded="loaded = true"
            >
            </stack>

            <easel-bitmap
                image="images/bookcase2-front.gif"
            >
            </easel-bitmap>

            <easel-bitmap
                image="images/bookcase2-shadow.gif"
                alpha=".5"
            >
            </easel-bitmap>

            <enzo-click-spot
                name="Lobby"
                x="15"
                y="150"
                @click="app.world.goTo('lobby')"
            >
                <easel-shape
                    form="rect"
                    x="-15"
                    y="-150"
                    :dimensions="[30, 255]"
                    fill="black"
                >
                </easel-shape>
            </enzo-click-spot>

            <text-layer
                v-if="!viewBook"
            >
            </text-layer>
        </sliding-window>

        <book-viewer
            v-if="viewBook"
            :book="viewBook"
            @close="viewBook = null"
        >
        </book-viewer>
    </easel-container>
</template>

<script>
import Stack from '@app/Stack';
import HasTextLayer from '@textLayer/HasTextLayer';
import BookViewer from '@app/BookViewer';
import SlidingWindow from '@app/SlidingWindow';

export default {
    mixins: [HasTextLayer],
    components: {
        Stack,
        BookViewer,
        SlidingWindow,
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
