<template>
    <easel-container>

        <lobby-desk
            :no-dialog="true"
            :say-words="say.words"
            @words-said="robotSaid"
        ></lobby-desk>

        <text-layer>
        </text-layer>

    </easel-container>
</template>

<script>
import LobbyDesk from '@app/LobbyDesk';
import HasTextLayer from '@textLayer/HasTextLayer';
import wait from '@libs/wait';
import doorAnswerPhrases from '@app/doorAnswerPhrases';

export default {
    inject: ['app'],
    mixins: [HasTextLayer],
    components: {
        LobbyDesk,
    },
    data() {
        return {
            say: {
                words: null,
                resolve: null,
            },
        };
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
                return this.showMessage(doorAnswerPhrases.pull(), 10, 75);
            } else {
                return this.robotSay("I'll get it!")
                    .then(() => this.app.world.leave('lobby-desk', 'lobby'))
                    .then(() => this.app.world.lobbyBotAnswerDoorbell(20000, 100));
            }
        },
        robotSay(text) {
            return new Promise(resolve => {
                this.say.words = text;
                this.say.resolve = resolve;
            });
        },
        robotSaid() {
            this.say.resolve();
        },
    },
};
</script>
