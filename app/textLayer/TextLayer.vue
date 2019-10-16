<!--
/**
 |---------------------------------
 | TextLayer
 |---------------------------------
 | Shows text, being careful not to clutter the display.
 |
 | This component is meant to be used by a parent that mixes in HasTextLayer,
 | which provides `textLayer`.
 |
 | In Mobile mode, it also shows a dot so users know where to tap.
 |
 | This component only shows one piece of text at a time. It favors text from
 | `messager` if there is any. Otherwise it uses text from `hoverer`.
 */
-->
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
            v-if="!textLayer.messager.message"
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
    inject: ['app', 'textLayer'],
    computed: {
        messager() {
            return this.textLayer.messager;
        },
        message() {
            return this.textLayer.messager.message || this.hovererMessage;
        },
        hovererMessage() {
            if (!this.textLayer.hoverer.message) {
                return null;
            } else {
                const component = this.textLayer.hoverer.message;
                return {
                    text: component.hoverName || component.name || '',
                    x: component.hoverX || component.x,
                    y: component.hoverY || component.y,
                };
            }
        },
    },
};
</script>
