
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
            this.textLayer.hoverer.hover(this, {
                text: this.name || this.hoverName,
                x: this.x,
                y: this.y,
            });
        },
        unhover() {
            this.textLayer.hoverer.unhover(this);
        },
    },
};
