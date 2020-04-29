/**
 |--------------------
 | VModelMixin
 |--------------------
 | Treat v-model as a writable prop called vModel
 */

export default {
    props: ['value'],
    computed: {
        vModel: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            },
        },
    },
};
