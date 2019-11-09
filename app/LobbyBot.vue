<template>
    <easel-container>
        <easel-container
            v-if="showQuestions"
            v-for="(question, i) in questions"
            :key="question.code"
        >
            <easel-shape
                :x="questionSlots[i].x"
                :y="questionSlots[i].y"
                form="rect"
                fill="grey"
                :dimensions="[questionSlots[i].width, questionSlots[i].height]"
                cursor="pointer"
                alpha="0.5"
                @click="ask(question)"
            >
            </easel-shape>
            <enzo-text
                :text="question.text"
                :x="questionSlots[i].x + 2"
                :y="questionSlots[i].y + 2"
                align="top-left"
                color="cyan"
            >
            </enzo-text>
        </easel-container>
    </easel-container>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';
import ChatBot from '@chat/ChatBot';
const {after} = ChatBot;

export default {
    inject: ['app', 'window'],
    mixins: [UsesTextLayer],
    mounted() {
        this.say(
            this.chatbot.wasAsked('Q1')
            ? [
                "Welcome back!",
            ]
            : [
                "Welcome to Enzo's Eused Ebooks!",
                "How can I help you today?",
            ]
        );
    },
    data() {
        return {
            chatbot: this.buildChatBot(),
            showQuestions: false,
        };
    },
    computed: {
        questions() {
            return this.chatbot.choose().slice(0, 4);
        },
        questionSlots() {
            return [
                this.slotDimensions(0),
                this.slotDimensions(1),
                this.slotDimensions(2),
                this.slotDimensions(3),
            ];
        },
    },
    methods: {
        buildChatBot(savedData, world) {
            return new ChatBot(this.app.world.lobbyBot)
                .add('Q1', "How do you play this game?",
                    [],
                    () => this.say('This is not a game; this is a bookstore.')
                )
                .add('Q4', "Where am I?",
                    [
                        after('Q1'),
                    ],
                    () => this.say("You are in Enzo's Eused Ebooks.")
                )
                .add('Q5', "But what is this game?",
                    [
                        after('Q4'),
                    ],
                    () => this.say([
                        "This is not a game. Enzo's is a bookstore completely unpersonalized to you!",
                        "Nothing in this store was chosen to suit your interests.",
                        "How refreshing!",
                    ])
                )
                .add('Q2', "I found this battery...",
                    [
                        () => this.app.world.battery.location === 'inventory',
                    ],
                    () => {
                        this.say('Unfortunately, I am not allowed to eat it.');
                    }
                )
                .add('Q3', "So... what should I do with this battery?",
                    [
                        after('Q2'),
                        () => this.app.world.battery.location === 'inventory',
                    ],
                    () => {
                        this.say('Please retain the delicious item until a staff member can attend to you.');
                    }
                )
                .add('X1', "Ok, bye.",
                    [],
                    () => this.app.world.goTo('Lobby'),
                    {keep: true}
                )
                ;
        },
        slotDimensions(i) {
            const d = this.window.dimensions;
            return {
                x: 4,
                y: d.height - 95 + i * 20,
                width: d.width - 8,
                height: 12,
            };
        },
        ask(question) {
            this.app.event('ask', ['lobby-bot', question.code].join(':'));
            this.showQuestions = false;
            this.queueMessage(question.text, 5, 200, 'cyan')
                .then(() => {
                    this.showQuestions = true;
                    this.chatbot.ask(question.code);
                });
        },
        say(texts) {
            this.showQuestions = false;
            if (!(texts instanceof Array)) {
                texts = [texts];
            }
            texts.reduce((n, text) => this.queueMessage(text, 100, 100), null)
                .then(() => {
                    this.showQuestions = true;
                });
        },
    },
};
</script>
