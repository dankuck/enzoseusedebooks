/**
 |---------------------------------
 | TextLayerMethods
 |---------------------------------
 | This mixin is not meant to be used on its own.
 |
 | Use either:
 |  HasTextLayer - if the component is intended to have a TextLayer child
 |  UsesTextLayer - if the component is intended to use a parent's TextLayer
 */

export default {
    methods: {
        addToHoverRing() {
            this.textLayer.mobileHoverRing.add(this.hoverCallback);
        },
        removeFromHoverRing() {
            this.textLayer.mobileHoverRing.remove(this.hoverCallback);
        },
        queueMessage(text, x, y, color = null, speed = null) {
            return this.textLayer.messager.queue({text, x, y, color}, speed);
        },
        queueMessageAt(x, y, color = null, speed = null) {
            return msg => this.queueMessage(msg, x, y, color, speed);
        },
        showMessage(text, x, y, color = null, speed = null) {
            return this.textLayer.messager.clear().queue({text, x, y, color}, speed);
        },
        showMessageAt(x, y, color = null, speed = null) {
            return msg => this.showMessage(msg, x, y, color, speed);
        },
        hover() {
            this.textLayer.hoverer.hover(this, this);
        },
        unhover() {
            this.textLayer.hoverer.unhover(this);
        },
    },
};
