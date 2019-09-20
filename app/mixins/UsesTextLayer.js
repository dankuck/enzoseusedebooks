import TextLayerMethods from '@mixins/TextLayerMethods';

export default {
    inject: ['textLayer'],
    mixins: [TextLayerMethods],
    mounted() {
        this.hoverCallback = () => this.hover();
        this.addToHoverRing();
    },
    destroyed() {
        this.removeFromHoverRing();
    },
};
