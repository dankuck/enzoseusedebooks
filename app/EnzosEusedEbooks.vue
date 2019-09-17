<template>
    <div id="canvas-div">
        <easel-canvas
            id="canvas"
            :width="canvas.width"
            :height="canvas.height"
            viewport-width="350"
            viewport-height="255"
            :anti-alias="false"
        >
            <lobby></lobby>
        </easel-canvas>
    </div>
</template>

<script>
import Lobby from './Lobby';

const pixelWidth = 350,
    pixelHeight = 255;

export default {
    components: {
        Lobby,
    },
    mounted() {
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
            canvas: {
                width: pixelWidth,
                height: pixelHeight,
            },
        };
    },
};
</script>
