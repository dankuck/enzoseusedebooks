<!--
/**
 |---------------------------------
 | ChildrenStack
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
            :start-x="(400 - window.dimensions.width) - 10"
        >
            <easel-bitmap
                image="images/bookcase3-back.gif"
            >
            </easel-bitmap>

            <stack
                :collection="app.world.collections.children"
                :shelves="[
                    [0 + 25, 350 - 14 + 25, 255, 260],
                    [0 + 25, 350 - 13 + 25, 209, 214],
                    [0 + 25, 350 - 12 + 25, 162, 169],
                    [0 + 25, 350 - 11 + 25, 118, 118],
                    [0 + 25, 350 - 10 + 25, 69, 66],
                ]"
                align="right"
                :hide-books="[viewBook]"
                @clickBook="selectBook"
                @loaded="loaded = true"
            >
            </stack>

            <easel-bitmap
                image="images/bookcase3-front.gif"
            >
            </easel-bitmap>

            <easel-bitmap
                image="images/bookcase3-shadow.gif"
                alpha=".5"
            >
            </easel-bitmap>

            <enzo-click-spot
                name="Lobby"
                :x="400 - 15"
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
    inject: ['app', 'window'],
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
