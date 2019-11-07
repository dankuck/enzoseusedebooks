<template>
    <easel-container>
        <enzo-text
            v-for="(question, i) in questions"
            :key="question.code"
            :text="question.text"
            :x="5"
            :y="5 + i * 10"
            align="top-left"
            color="cyan"
            cursor="pointer"
            @click="chatbot.ask(question.code)"
        >
        </enzo-text>
    </easel-container>
</template>

<script>
import ChatBot from '@chat/ChatBot';

const buildChatBot = function (savedData) {
    return new ChatBot(savedData)
        .add('Q1', [], "How do you play this game?", () => {
            alert('not a game');
        })
        ;
};

export default {
    inject: ['app'],
    data() {
        return {
            chatbot: buildChatBot(this.app.world.lobbyBot),
        };
    },
    computed: {
        questions() {
            return this.chatbot.choose();
        },
    },
};
</script>
