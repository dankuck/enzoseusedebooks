<template>
    <component :is="app.world.location"></component>
</template>

<script>
import Lobby from '@app/Lobby';
import FictionStack from '@app/FictionStack';
import NonfictionStack from '@app/NonfictionStack';
import ChildrenStack from '@app/ChildrenStack';
import LobbyDesk from '@app/LobbyDesk';

export default {
    components: {
        Lobby,
        FictionStack,
        NonfictionStack,
        ChildrenStack,
        LobbyDesk,
    },
    inject: ['app'],
    provide() {
        return {
            window: this,
        };
    },
    computed: {
        dimensions() {
            return {
                x: 0,
                y: 0,
                width: this.app.roomSize.width,
                height: this.app.roomSize.height,
            };
        },
    },
};
</script>
