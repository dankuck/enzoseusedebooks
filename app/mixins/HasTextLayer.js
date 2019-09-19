
import TextLayer from '@app/TextLayer';
import Messager from '@libs/Messager';
import Hoverer from '@libs/Hoverer';

export default {
    components: {
        TextLayer,
    },
    provide() {
        return {
            textLayer: this.textLayer,
        };
    },
    data() {
        return {
            textLayer: {
                messager: new Messager(2000),
                hoverer: new Hoverer(250),
            },
        };
    },
    methods: {
        queueMessage(text, x, y) {
            this.textLayer.messager.queue({text, x, y});
        },
        showMessage(text, x, y) {
            this.textLayer.messager.clear().queue({text, x, y});
        },
    },
};
