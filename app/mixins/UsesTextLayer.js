
export default {
    inject: ['messager', 'hoverer'],
    methods: {
        hover() {
            this.hoverer.hover(this);
        },
        unhover() {
            this.hoverer.unhover(this);
        },
    },
};
