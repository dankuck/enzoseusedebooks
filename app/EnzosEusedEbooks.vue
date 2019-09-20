<template>
    <div id="canvas-div">
        <dev-tools v-if="config.develop"></dev-tools>
        <easel-canvas
            ref="canvas"
            id="canvas"
            :width="canvas.width"
            :height="canvas.height"
            viewport-width="350"
            viewport-height="255"
            :anti-alias="false"
        >
            <lobby></lobby>
            <dev-elements v-if="config.develop"></dev-elements>
        </easel-canvas>
        <easel-canvas>
            <easel-text
                color="#CCC"
                text="A hack to induce the font to preload."
                font="7px 'Press Start 2P'"
            >
            </easel-text>
        </easel-canvas>
    </div>
</template>

<script>
import Lobby from '@app/Lobby';
import DevTools from '@develop/Tools';
import DevElements from '@develop/Elements';
import config from '@/config';

export const pixelWidth = 350;
export const pixelHeight = 255;

export default {
    components: {
        Lobby,
        DevTools,
        DevElements,
    },
    mounted() {
        // In a future version of vue-easeljs, this will be handled automatically.
        // https://github.com/dankuck/vue-easeljs/issues/28
        this.$refs.canvas.component.enableMouseOver();

        this.resizer = () => {
            const parent = this.$el.parentNode;
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
            const adjustedHeight = this.canvas.width * pixelHeight / pixelWidth;
            const adjustedWidth = this.canvas.height * pixelWidth / pixelHeight;
            if (adjustedWidth < this.canvas.width) {
                this.canvas.width = adjustedWidth;
            }
            if (adjustedHeight < this.canvas.height) {
                this.canvas.height = adjustedHeight;
            }
        };
        window.addEventListener('resize', this.resizer);
        this.resizer();
    },
    destroyed() {
        window.removeEventListener('resize', this.resizer);
    },
    data() {
        return {
            config,
            canvas: {
                width: pixelWidth,
                height: pixelHeight,
            },
        };
    },
};
</script>