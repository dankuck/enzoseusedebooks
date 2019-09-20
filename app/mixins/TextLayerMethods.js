
export default {
    methods: {
        addToHoverRing() {
            this.textLayer.mobileHoverRing.add(this.hoverCallback);
        },
        removeFromHoverRing() {
            this.textLayer.mobileHoverRing.remove(this.hoverCallback);
        },
        queueMessage(text, x, y) {
            this.textLayer.messager.queue({text, x, y});
        },
        showMessage(text, x, y) {
            this.textLayer.messager.clear().queue({text, x, y});
        },
        hover() {
            this.textLayer.hoverer.hover(this, this);
        },
        unhover() {
            this.textLayer.hoverer.unhover(this);
        },
    },
};
