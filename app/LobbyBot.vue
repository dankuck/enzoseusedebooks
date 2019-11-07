<template>
    <easel-container>
        <easel-container
            v-for="(question, i) in questions"
            :key="question.code"
        >
            <easel-shape
                :x="5 - 1"
                :y="5 + i * 20 - 1"
                form="rect"
                fill="grey"
                :dimensions="[340, 10]"
                cursor="pointer"
                alpha="0.5"
                @click="chatbot.ask(question.code)"
            >
            </easel-shape>
            <enzo-text
                :text="question.text"
                :x="5"
                :y="5 + i * 20"
                align="top-left"
                color="cyan"
            >
            </enzo-text>
        </easel-container>
    </easel-container>
</template>

<script>
import ChatBot from '@chat/ChatBot';
const {after} = ChatBot;

export default {
    inject: ['app'],
    data() {
        return {
            chatbot: this.buildChatBot(),
        };
    },
    computed: {
        questions() {
            return this.chatbot.choose();
        },
    },
    methods: {
        buildChatBot(savedData, world) {
            const chatbot = new ChatBot(this.app.world.lobbyBot)
                .add('Q1', "How do you play this game?", [], () => {
                    alert('This is not a game; this is a bookstore.');
                })
                .add('Q2', "I found this battery...",
                    [
                        () => this.app.world.battery.location === 'inventory',
                    ],
                    () => {
                        alert('Unfortunately, I am not allowed to eat it.');
                    }
                )
                .add('Q3', "Then what should I do with this battery?",
                    [
                        after('Q2'),
                        () => this.app.world.battery.location === 'inventory',
                    ],
                    () => {
                        alert('Please retain the delicious item until a staff member can attend to you.');
                    }
                )
                ;
            return chatbot;
        },
    },
};
</script>
