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
            v-if="showGame"
            ref="canvas"
            id="canvas"
            :width="app.canvas.width"
            :height="app.canvas.height"
            :viewport-width="app.viewport.width"
            :viewport-height="app.viewport.height"
            :anti-alias="false"
        >

            <room></room>

            <cutscene
                v-if="app.world.cutscene"
                v-model="app.world.cutscene"
            >
            </cutscene>

            <inventory
                :x="0"
                :y="app.roomSize.height"
                :items="app.world.inventory"
            >
            </inventory>

            <dev-elements v-if="app.config.developmentMode"></dev-elements>
        </easel-canvas>
        <easel-canvas
            v-else
        >
            <easel-text
                color="#CCC"
                text="A hack to induce the font to load."
                font="7px 'Press Start 2P'"
            >
            </easel-text>
        </easel-canvas>
        <div id="footer">
            &copy; 2019
            <a href="https://facebook.com/enzoseused">FB</a>
            <a href="https://twitter.com/enzoseused">TW</a>
        </div>
    </div>
</template>

<script>
import DevTools from '@develop/Tools';
import DevElements from '@develop/Elements';
import Inventory from '@app/Inventory';
import Room from '@app/Room';
import Cutscene from '@app/Cutscene';

export default {
    components: {
        DevTools,
        DevElements,
        Inventory,
        Room,
        Cutscene,
    },
    inject: ['app'],
    provide() {
        return {
            window: this,
        };
    },
    data() {
        return {
            showGame: false,
        };
    },
    mounted() {
        if (document.fonts) {
            const start = new Date();
            let loady = setInterval(() => {
                if (document.fonts.check('bold 16px "Press Start 2P"') || new Date() - start > 500 /*ms*/) {
                    this.showGame = true;
                    clearInterval(loady);
                }
            }, 100);
        } else {
            // no easy way to check if the font loaded.
            this.showGame = true;
        }
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
