
import TextLayer from '../TextLayer';
import Messager from '../libs/Messager';
import Hoverer from '../libs/Hoverer';

export default {
    components: {
        TextLayer,
    },
    provide() {
        return {
            messager: this.messager,
            hoverer: this.hoverer,
        };
    },
    data() {
        return {
            messager: new Messager(2000),
            hoverer: new Hoverer(),
        };
    },
};
