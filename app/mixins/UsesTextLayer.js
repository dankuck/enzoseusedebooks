
export default {
    inject: ['textLayer'],
    methods: {
        queueMessage(message) {
            this.textLayer.messager.queue(message);
        },
        showMessage(message) {
            this.textLayer.messager.clear().queue(message);
        },
        hover() {
            this.textLayer.hoverer.hover(this);
        },
        unhover() {
            this.textLayer.hoverer.unhover(this);
        },
    },
};
