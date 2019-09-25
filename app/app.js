/**
 |---------------------------------
 | app.js
 |---------------------------------
 | This is the root of the whole app.
 |
 | It handles screen sizing, and providing globally useful tools and data.
 |
 | Provides itself as `app` to all descendants.
 |
 | Data includes:
 |  config: data from config.js
 |  isMobile: dynamic boolean is true if the screen size looks like mobile
 |  canvas.pixelWidth: the width of the canvas internally
 |  canvas.pixelHeight: the height of the canvas internally
 |  canvas.width: the HTML page width of the canvas
 |  canvas.height: the HTML page height of the canvas
 |  storage: a JsonStorage object that persists data to localStorage
 |  world: the World object
 |
 | This class does NOT handle rendering anything directly or choosing which
 | components are rendered. That's left to the EnzosEusedEbooks component.
 */

// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;

import EnzoText from '@app/EnzoText.vue';
import EnzoClickSpot from '@app/EnzoClickSpot.vue';
import EnzosEusedEbooks from '@app/EnzosEusedEbooks.vue';
import config from '@/config';
import JsonStorage from '@libs/JsonStorage';
import World from '@world/World';
import Reviver from '@libs/Reviver';

Vue.use(VueEaseljs);

Vue.component('enzo-text', EnzoText);
Vue.component('enzo-click-spot', EnzoClickSpot);

const reviver = new Reviver();
reviver.add(
    World,
    (key, data) => World.reviveFromJson(data),
    (key, data) => data.replaceForJson()
);

const storage = new JsonStorage(
    window.localStorage,
    'enzos-eused-ebooks',
    reviver
);

const world = storage.read('world') || new World();

const app = new Vue({
    el: '#app',
    components: {
        EnzosEusedEbooks,
    },
    provide() {
        return {
            app: this,
        };
    },
    mounted() {
        this.resizer = () => {
            const parent = this.$el.parentNode;
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
            const adjustedHeight = this.canvas.width * this.canvas.pixelHeight / this.canvas.pixelWidth;
            const adjustedWidth = this.canvas.height * this.canvas.pixelWidth / this.canvas.pixelHeight;
            if (adjustedWidth < this.canvas.width) {
                this.canvas.width = adjustedWidth;
            }
            if (adjustedHeight < this.canvas.height) {
                this.canvas.height = adjustedHeight;
            }
            this.isMobile = screen.width <= 768;
        };
        window.addEventListener('resize', this.resizer);
        this.resizer();
        this.$watch(
            'world',
            () => this.storage.write('world', this.world),
            {deep: true}
        );
    },
    destroyed() {
        window.removeEventListener('resize', this.resizer);
    },
    data() {
        return {
            config,
            isMobile: false,
            canvas: {
                pixelWidth: 350,
                pixelHeight: 255,
                width: 350,
                height: 255,
            },
            storage,
            world,
        };
    },
});
