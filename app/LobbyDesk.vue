<template>
    <easel-container>
        <easel-bitmap
            image="images/desk.gif"
        >
        </easel-bitmap>

        <enzo-click-spot
            v-if="app.world.lobbyBot.location !== 'lobby-desk'"
            name="Lobby"
            :x="15"
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

        <enzo-named-container
            :name="cheeseIsVisible ? 'A slice of cheese in a book' : 'I Am The Cheese'"
            x="17"
            y="150"
        >
            <easel-bitmap
                :image="bookIsOpen ? 'images/i-am-the-cheese-open-desk.gif' : 'images/i-am-the-cheese-desk.gif'"
                x="51"
                y="15"
                align="bottom-right"
                @click="touchTheBook()"
            >
            </easel-bitmap>

            <easel-bitmap
                v-if="cheeseIsVisible"
                image="images/i-am-the-cheese-desk-cheese.gif"
                x="36"
                y="6"
                align="bottom-right"
                @click="touchTheBook()"
            >
            </easel-bitmap>
        </enzo-named-container>

        <lobby-bot
            v-if="app.world.lobbyBot.location === 'lobby-desk'"
            :no-dialog="noDialog"
            :say-words="sayWords"
            @words-said="$emit('words-said')"
        >
        </lobby-bot>

        <text-layer>
        </text-layer>
    </easel-container>
</template>

<script>
import HasTextLayer from '@textLayer/HasTextLayer';
import LobbyBot from '@app/LobbyBot';

export default {
    inject: ['app'],
    mixins: [HasTextLayer],
    components: {
        LobbyBot,
    },
    props: ['noDialog', 'sayWords'],
    data() {
        return {
            bookIsOpen: false,
        };
    },
    computed: {
        cheeseIsVisible() {
            return this.bookIsOpen && this.app.world.theCheese.location === 'book';
        },
    },
    watch: {
        'app.world.lobbyBot.someoneTriedToGrabTheCheeseNow': {
            handler() {
                if (this.app.world.lobbyBot.someoneTriedToGrabTheCheeseNow
                    && this.app.world.lobbyBot.location !== 'lobby-desk'
                ) {
                    this.app.world.lobbyBot.someoneTriedToGrabTheCheeseNow = false;
                    this.bookIsOpen = !this.bookIsOpen;
                }
            },
            immediate: true,
        },
    },
    methods: {
        touchTheBook() {
            if (this.cheeseIsVisible) {
                this.app.world.takeCheese();
            } else {
                this.app.world.touchIAmTheCheese();
            }
        },
    },
}
</script>
