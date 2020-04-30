<template>
    <easel-container>
        <easel-bitmap
            image="images/desk.gif"
        >
        </easel-bitmap>

        <enzo-named-container
            name="I Am The Cheese"
            x="17"
            y="150"
        >
            <easel-bitmap
                image="images/i-am-the-cheese-desk.gif"
                @click="app.world.touchIAmTheCheese()"
            >
            </easel-bitmap>
        </enzo-named-container>

        <lobby-bot
            v-if="app.world.lobbyBot.location === 'lobby-desk'"
            :no-dialog="noDialog"
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
    props: ['noDialog'],
}
</script>
