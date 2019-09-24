/**
 |---------------------------------
 | HasTextLayer
 |---------------------------------
 | This mixin provides several TextLayer related tools.
 |
 | It provides `textLayer`, which has these elements:
 |  `messager` - used to hold temporary messages
 |  `hoverer` - used to hold information to show when hovering over a component
 |  `mobileHoverRing` - used to cycle through hoverable items and imitate a
 |                      hover action
 |
 | This mixin activates and deactivates auto-hover behavior when the browser
 | appears to be in mobile mode.
 |
 | This also mixes in methods from TextLayerMethods:
 |  `queueMessage(text, x, y)` - put a message on TextLayer queue
 |  `showMessage(text, x, y)` - show a mesage on TextLayer, replacing the queue
 |  `hover()` - show this component's name or hoverName
 |  `unhover()` - stop showing this component's name or hoverName
 */

import TextLayer from '@textLayer/TextLayer';
import Messager from '@libs/Messager';
import Hoverer from '@libs/Hoverer';
import CallbackRing from '@libs/CallbackRing';
import TextLayerMethods from '@textLayer/TextLayerMethods';

export default {
    components: {
        TextLayer,
    },
    mixins: [TextLayerMethods],
    inject: ['app'],
    provide() {
        return {
            textLayer: this.textLayer,
        };
    },
    mounted() {
        this.$watch('app.isMobile', () => {
            this.startStopMobileHoverRing();
        });
        this.startStopMobileHoverRing();
    },
    data() {
        return {
            textLayer: {
                messager: new Messager(2000),
                hoverer: new Hoverer(250),
                mobileHoverRing: new CallbackRing(1500),
            },
        };
    },
    methods: {
        startStopMobileHoverRing() {
            this.app.isMobile
                ? this.textLayer.mobileHoverRing.start()
                : this.textLayer.mobileHoverRing.stop();
        },
    },
};
