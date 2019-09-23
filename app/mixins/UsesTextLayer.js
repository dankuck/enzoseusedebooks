/**
 |---------------------------------
 | UsesTextLayer
 |---------------------------------
 | This mixin provides several TextLayer related tools.
 |
 | It requires a parent that mixes in HasTextLayer.
 |
 | This mixin adds the component to the auto-hover list.
 |
 | This also mixes in methods from TextLayerMethods:
 |  `queueMessage(text, x, y)` - put a message on TextLayer queue
 |  `showMessage(text, x, y)` - show a mesage on TextLayer, replacing the queue
 |  `hover()` - show this component's name or hoverName
 |  `unhover()` - stop showing this component's name or hoverName
 */

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
