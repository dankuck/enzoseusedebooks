<template>
    <div id="canvas-div">
        <dev-tools v-if="app.config.developmentMode"></dev-tools>
        <easel-canvas
            ref="canvas"
            id="canvas"
            :width="app.canvas.width"
            :height="app.canvas.height"
            :viewport-width="app.canvas.pixelWidth"
            :viewport-height="app.canvas.pixelHeight"
            :anti-alias="false"
        >
            <lobby></lobby>
            <dev-elements v-if="app.config.developmentMode"></dev-elements>
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

export default {
    components: {
        Lobby,
        DevTools,
        DevElements,
    },
    inject: ['app'],
};
</script>
