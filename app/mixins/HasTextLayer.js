
import TextLayer from '@app/TextLayer';
import Messager from '@libs/Messager';
import Hoverer from '@libs/Hoverer';
import CallbackRing from '@libs/CallbackRing';
import TextLayerMethods from '@mixins/TextLayerMethods';

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
