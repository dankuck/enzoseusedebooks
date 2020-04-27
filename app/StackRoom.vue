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

            <enzo-named-container
                v-if="doorbellIsHere"
                name="Wireless Doorbell"
                :x="app.world.doorbell.stackLocation.x"
                :y="app.world.doorbell.stackLocation.y"
            >
                <easel-bitmap
                    image="images/doorbell.gif"
                    align="left-bottom"
                    x="1"
                    @click="takeDoorbell"
                >
                </easel-bitmap>
            </enzo-named-container>

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
            @close="returnBook"
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
        'name',
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
        doorbellIsHere() {
            const {location, stack} = this.app.world.doorbell;
            return location === 'shelf' && stack === this.name;
        },
    },
    methods: {
        selectBook(book, {x, y}) {
            if (this.app.world.canFindDoorbell()) {
                this.showMessage("Hey, there was something behind this book.", x, y);
                this.app.world.doorbell = {
                    location: 'shelf',
                    stack: this.name,
                    stackLocation: {x, y},
                };
            } else {
                this.viewBook = book;
            }
        },
        returnBook() {
            this.viewBook = null
        },
        takeDoorbell() {
            const {x, y} = this.app.world.doorbell.stackLocation;
            this.app.world.takeDoorbell(msg => this.queueMessage(msg, x, y));
        },
    },
};
</script>
