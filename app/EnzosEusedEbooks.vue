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
            <component :is="app.world.location"></component>

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
import Lobby from '@app/Lobby';
import FictionStack from '@app/FictionStack';
import NonfictionStack from '@app/NonfictionStack';
import ChildrenStack from '@app/ChildrenStack';
import DevTools from '@develop/Tools';
import DevElements from '@develop/Elements';
import Inventory from '@app/Inventory';

export default {
    components: {
        Lobby,
        FictionStack,
        NonfictionStack,
        ChildrenStack,
        DevTools,
        DevElements,
        Inventory,
    },
    inject: ['app'],
};
</script>
