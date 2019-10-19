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
    <easel-container>
        <easel-bitmap
            image="bookcase3-back.gif"
        >
        </easel-bitmap>

        <stack
            :collection="app.world.collections.children"
            :shelves="[
                [0, 350 - 10, 69, 66],
                [0, 350 - 11, 118, 118],
                [0, 350 - 12, 162, 169],
                [0, 350 - 13, 209, 214],
                [0, 350 - 14, 255, 260],
            ]"
            @clickBook="selectBook"
        >
        </stack>

        <easel-bitmap
            image="bookcase3-front.gif"
        >
        </easel-bitmap>

        <enzo-click-spot
            name="Lobby"
            x="345"
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
