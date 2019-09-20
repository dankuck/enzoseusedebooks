<template>
    <easel-container
        v-if="message"
    >
        <enzo-text
            :text="message.text"
            :x="message.x"
            :y="message.y"
            :buffer="app.isMobile ? 3 : 0"
        >
        </enzo-text>
        <easel-container
            v-if="!messager.message"
        >
            <easel-shape
                v-if="app.isMobile"
                form="rect"
                :dimensions="[3, 3]"
                fill="white"
                :x="message.x"
                :y="message.y"
            >
            </easel-shape>
            <easel-shape
                v-if="app.isMobile"
                form="rect"
                :dimensions="[1, 1]"
                fill="black"
                :x="message.x + 1"
                :y="message.y + 1"
            >
            </easel-shape>
        </easel-container>
    </easel-container>
</template>

<script>
export default {
    inject: ['app'],
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
