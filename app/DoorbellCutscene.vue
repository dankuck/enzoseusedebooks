<template>
    <easel-container>

        <lobby-desk :cutscene="true"></lobby-desk>

        <text-layer>
        </text-layer>

    </easel-container>
</template>

<script>
import LobbyDesk from '@app/LobbyDesk';
import HasTextLayer from '@textLayer/HasTextLayer';
import wait from '@libs/wait';

export default {
    inject: ['app'],
    mixins: [HasTextLayer],
    components: {
        LobbyDesk,
    },
    mounted() {
        this.showMessage('~ DING ~', 10, 50, 'white', 750)
            .then(() => this.showMessage('~ DONG ~', 20, 65, 'white', 1000))
            .then(() => wait(500))
            .then(() => this.showMessage("I'll get it!", 100, 100))
            .then(() => this.bounceFromDesk())
            .then(() => this.$emit('done'));
    },
    methods: {
        /**
         * If we're currently at the desk, leave, because we don't want to
         * animate the robot when he goes to answer the door.
         */
        bounceFromDesk() {
            if (this.app.world.location === 'lobby-desk') {
                this.app.world.goTo('lobby');
            }
        },
    },
};
</script>
