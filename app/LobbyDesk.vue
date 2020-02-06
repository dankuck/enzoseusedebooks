<template>
    <easel-container>
        <easel-bitmap
            image="images/desk.gif"
        >
        </easel-bitmap>

        <lobby-bot>
        </lobby-bot>

        <text-layer
        >
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
}
</script>
