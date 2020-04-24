<!--
/**
 |---------------------------------
 | StackRoom
 |---------------------------------
 | This component is a visual context.
 |
 | It shows a stack, based on the images, books, and dimensions given in props.
 */
-->

<template>
    <easel-container :visible="loaded">
        <sliding-window
            :width="width"
            :start-x="startX"
        >
            <easel-bitmap
                :image="backgroundImage"
            >
            </easel-bitmap>

            <stack
                :collection="collection"
                :shelves="shelves"
                :align="align"
                :hide-books="[viewBook]"
                @clickBook="selectBook"
                @loaded="loaded = true"
            >
            </stack>

            <easel-bitmap
                :image="bookcaseImage"
            >
            </easel-bitmap>

            <easel-bitmap
                :image="shadowImage"
                alpha=".5"
            >
            </easel-bitmap>

            <enzo-click-spot
                name="Lobby"
                :x="lobbyX"
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
    props: [
        'width',
        'startX',
        'backgroundImage',
        'collection',
        'shelves',
        'align',
        'bookcaseImage',
        'shadowImage',
        'lobbySide',
    ],
    data() {
        return {
            viewBook: null,
            loaded: false,
        };
    },
    computed: {
        lobbyX() {
            return this.lobbySide === 'right' ? this.width - 15 : 15;
        },
    },
    methods: {
        selectBook(book) {
            this.viewBook = book;
        },
    },
};
</script>
