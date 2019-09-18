<template>
    <enzo-text
        v-if="message"
        :text="message.text"
        :x="message.x"
        :y="message.y"
    >
    </enzo-text>
</template>

<script>
export default {
    props: ['messager', 'hoverer'],
    computed: {
        message() {
            return this.messager.message || this.hoverer.message;
        },
    },
};
</script>
