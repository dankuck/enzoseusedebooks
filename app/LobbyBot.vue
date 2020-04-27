<template>
    <easel-container>
        <easel-container
            x="160"
            y="55"
        >
            <easel-bitmap
                image="images/Jeff-body.gif"
            >
            </easel-bitmap>
            <easel-bitmap
                image="images/Jeff-eye.gif"
                :x="34"
                :y="6"
            >
            </easel-bitmap>
            <easel-bitmap
                image="images/Jeff-eye.gif"
                :x="51"
                :y="6"
            >
            </easel-bitmap>
            <easel-bitmap
                image="images/Jeff-pupil.gif"
                :x="38 + eyes.x"
                :y="15 + eyes.y"
            >
            </easel-bitmap>
            <easel-bitmap
                image="images/Jeff-pupil.gif"
                :x="55 + eyes.x"
                :y="15 + eyes.y"
            >
            </easel-bitmap>
            <easel-sprite-sheet
                :images="['images/Jeff-mouth.gif']"
                :framerate="4"
                :frames="{width: 16, height: 6}"
                :animations="{
                    off: 1,
                    on: 0,
                }"
            >
                <easel-sprite
                    :x="40"
                    :y="29"
                    :animation="mouthAnimation"
                >
                </easel-sprite>
            </easel-sprite-sheet>
        </easel-container>

        <enzo-named-container
            name="I Am The Cheese"
            x="17"
            y="150"
        >
            <easel-bitmap
                image="images/i-am-the-cheese-desk.gif"
                @click="clickIAmTheCheese()"
            >
            </easel-bitmap>
        </enzo-named-container>

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
const {after, always, everySession} = ChatBot;

export default {
    inject: ['app', 'window'],
    mixins: [UsesTextLayer],
    mounted() {
        this.say(this.intro);
        setInterval(() => this.wanderEyes(), 1000);
        setInterval(() => this.moveEyes(), 100);
    },
    data() {
        return {
            chatbot: this.buildChatBot(),
            showQuestions: false,
            mouthAnimation: 'off',
            talkInterval: null,
            moveEyesTo: {
                x: 0,
                y: 0,
            },
            eyes: {
                x: 0,
                y: 0,
            },
        };
    },
    computed: {
        intro() {
            const cheeseRebuff = this.pullCheeseRebuff();
            if (this.chatbot.wasAsked('Q1')) {
                return cheeseRebuff.length === 0
                    ? [
                        "Welcome back!",
                    ]
                    : cheeseRebuff;
            } else {
                return [
                    ...cheeseRebuff,
                    "Welcome to Enzo's Eused Ebooks!",
                    "How can I help you today?",
                ];
            }
        },
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
        buildChatBot() {
            return new ChatBot(this.app.world.lobbyBot)
                .add('Q1', "How do you play this game?",
                    [],
                    () => this.say([
                        "This is not a game; this is a bookstore.",
                        "It is completely unpersonalized to you!",
                        "Nothing at Enzo's was chosen to suit your interests.",
                        "How refreshing!",
                    ])
                )
                .add('Q5', "How do you play this bookstore?",
                    [
                        after('Q1'),
                    ],
                    () => this.say([
                        "Well, there are some mysteries around here.",
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
                        everySession(),
                        () => this.app.world.battery.location === 'inventory',
                    ],
                    () => {
                        this.say('Please retain the delicious item until a staff member can attend to you.');
                    },
                )
                .add('Q6', "Is there anything else to do?",
                    [
                        after('Q3'),
                        () => this.app.world.completedAllSteps(),
                    ],
                    () => this.say([
                        "You could follow Enzo's on Facebook and Twitter!",
                        "Every time something new happens in the bookstore, it will be announced there.",
                    ]),
                )
                .add('Q7', "Is there anything else to do?",
                    [
                        after('Q6'),
                        everySession(),
                        () => this.app.world.completedAllSteps(),
                    ],
                    () => this.say([
                        "So far, just that thing I said...",
                        "Follow Enzo's on Facebook and Twitter.",
                        "New developments will be announced there.",
                    ]),
                )
                .add('Q8', "Why can't I touch the cheese book?",
                    [
                        everySession(),
                        () => this.app.world.lobbyBot.someoneTriedToGrabTheCheeseOneTime,
                    ],
                    () => this.say([
                        "I have been ordered by Mr. Enzo to protect the cheese book.",
                    ])
                )
                .add('X1', "Ok, bye.",
                    [
                        always(),
                    ],
                    () => this.app.world.goTo('Lobby'),
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
            this.startTalking();
            texts = [].concat(texts);
            return texts.reduce((n, text) => this.queueMessage(text, 100, 100), null)
                .then(() => {
                    this.stopTalking();
                    this.showQuestions = true;
                });
        },
        startTalking() {
            this.stopTalking();
            this.mouthAnimation = 'on';
            this.talkInterval = setInterval(() => {
                this.mouthAnimation = Math.random() < .5 ? 'on' : 'off';
            }, 100);
        },
        stopTalking() {
            if (this.talkInterval) {
                clearInterval(this.talkInterval);
                this.talkInterval = null;
                this.mouthAnimation = 'off';
            }
        },
        wanderEyes() {
            if (!this.showQuestions) {
                this.moveEyesTo.x = 0;
                this.moveEyesTo.y = 0;
                return;
            }
            if (Math.random() < .5) {
                return;
            }
            this.moveEyesTo.x = Math.floor(Math.random() * 5) - 2;
            this.moveEyesTo.y = Math.floor(Math.random() * 5) - 2;
        },
        moveEyes() {
            const dX = this.moveEyesTo.x - this.eyes.x;
            const dY = this.moveEyesTo.y - this.eyes.y;
            if (dX !== 0) {
                this.eyes.x += dX < 0 ? -1 : 1;
            }
            if (dY !== 0) {
                this.eyes.y += dY < 0 ? -1 : 1;
            }
        },
        /**
         * If someone tried to grab the cheese book, then the bot needs to
         * rebuff them and reset the bit.
         * @return array
         */
        pullCheeseRebuff() {
            if (this.app.world.lobbyBot.someoneTriedToGrabTheCheeseNow) {
                this.app.world.lobbyBot.someoneTriedToGrabTheCheeseNow = false;
                return [
                    "I'm sorry, no one is allowed to touch the cheese book.",
                ];
            } else {
                return [];
            }
        },
        clickIAmTheCheese() {
            this.app.world.touchIAmTheCheese();
            const rebuff = this.pullCheeseRebuff();
            this.say(rebuff);
        },
    },
};
</script>
