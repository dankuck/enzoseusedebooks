<!--
/**
 |---------------------------------
 | EnzosEusedEbooks
 |---------------------------------
 | This is the visual root of the app.
 |
 | The main job of this component is to control what visual context the user
 | sees. IE, what room the user is in. Its secondary role is to contain global
 | visual elements, such as development tools.
 |
 | This component is NOT responsible for resizing/mobile-detection or providing
 | globally useful tools or data to descendent components. That is the
 | responsibility of app.js.
 */
-->
<template>
    <div id="canvas-div">
        <dev-tools v-if="app.config.developmentMode"></dev-tools>
        <easel-canvas
            ref="canvas"
            id="canvas"
            :width="app.canvas.width"
            :height="app.canvas.height"
            :viewport-width="app.viewport.width"
            :viewport-height="app.viewport.height"
            :anti-alias="false"
        >
            <room></room>

            <inventory
                :x="0"
                :y="app.roomSize.height"
                :items="app.world.inventory"
            >
            </inventory>

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
import DevTools from '@develop/Tools';
import DevElements from '@develop/Elements';
import Inventory from '@app/Inventory';
import Room from '@app/Room';

export default {
    components: {
        DevTools,
        DevElements,
        Inventory,
        Room,
    },
    inject: ['app'],
    provide() {
        return {
            window: this,
        };
    },
    computed: {
        dimensions() {
            return {
                x: 0,
                y: 0,
                width: this.app.viewport.width,
                height: this.app.viewport.height,
            };
        },
    },
};
</script>
