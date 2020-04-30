<template>
    <easel-container>

        <lobby-desk :no-dialog="true"></lobby-desk>

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
        /**
         * Make doorbell noises, make the robot say "I'll get it!", then if
         * we're at the lobby-desk, leave so we don't have to animate the robot
         * exiting lobby-desk.
         */
        this.ringBell()
            .then(() => wait(500))
            .then(() => this.respondToBell())
            .then(() => this.$emit('done'));
    },
    methods: {
        ringBell() {
            return this.showMessage('~ DING ~', 10, 50, 'white', 750)
                .then(() => this.showMessage('~ DONG ~', 20, 65, 'white', 1000));
        },
        respondToBell() {
            if (this.app.world.lobbyBot.location !== 'lobby-desk') {
                return this.showMessage(Math.random() < 0.5 ? "I'm coming!" : "Hold your electric sheep!", 10, 75);
            } else {
                return this.showMessage("I'll get it!", 100, 100)
                    .then(() => this.app.world.leave('lobby-desk', 'lobby'))
                    .then(() => this.app.world.lobbyBotAnswerDoorbell(20000));
            }
        },
    },
};
</script>
