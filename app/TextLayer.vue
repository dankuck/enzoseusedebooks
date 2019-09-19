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
            return this.messager.message || this.hovererMessage;
        },
        hovererMessage() {
            if (!this.hoverer.message) {
                return null;
            } else {
                const component = this.hoverer.message;
                return {
                    text: component.name || component.hoverName,
                    x: component.x,
                    y: component.y,
                };
            }
        },
    },
};
</script>
