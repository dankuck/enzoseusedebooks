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
 |  viewport.width: the width of the canvas internally
 |  viewport.height: the height of the canvas internally
 |  canvas.width: the HTML page width of the canvas
 |  canvas.height: the HTML page height of the canvas
 |  roomSize.width: the width of the room area
 |  roomSize.height: the height of the room area
 |  inventorySize.width: the width of the inventory area
 |  inventorySize.height: the height of the inventory area
 |  storage: a JsonStorage object that persists data to localStorage
 |  world: the World object
 |
 | This class does NOT handle rendering anything directly or choosing which
 | components are rendered. That's left to the EnzosEusedEbooks component.
 */


import EnzoText from '@app/EnzoText.vue';
import EnzoClickSpot from '@app/EnzoClickSpot.vue';
import EnzoHoverSpot from '@app/EnzoHoverSpot.vue';
import EnzosEusedEbooks from '@app/EnzosEusedEbooks.vue';
import config from '@/config';
import JsonStorage from '@libs/JsonStorage';
import World from '@world/World';
import reviver from '@app/reviver';
import axios from 'axios';
import ColorReducer from '@libs/ColorReducer';
import GoogleAnalyticsEventer from '@logs/GoogleAnalyticsEventer';
import LogEventer from '@logs/LogEventer';
import NullEventer from '@logs/NullEventer';

// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;
window.axios = axios;
window.reviver = reviver;

Vue.use(VueEaseljs);
VueEaseljs.registerFilter('ColorReducer', ColorReducer);

Vue.component('enzo-text', EnzoText);
Vue.component('enzo-click-spot', EnzoClickSpot);
Vue.component('enzo-hover-spot', EnzoHoverSpot);

const storage = new JsonStorage(
    window.localStorage,
    'enzos-eused-ebooks',
    reviver
);

const world = storage.read('world') || new World();

const event = config.events === 'google-analytics'
    ? GoogleAnalyticsEventer(ga)
    : config.events === 'logs'
    ? LogEventer
    : NullEventer;

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
            // We want to know if this is mobile, but really that's just
            // because we want to know if there are pointing devices
            this.isMobile = window.matchMedia
                ? window.matchMedia('(any-hover: none)').matches
                : screen.width <= 768;
            this.resize();
        };
        window.addEventListener('resize', this.resizer);
        this.resizer();
        this.$watch(
            'world',
            () => this.storage.write('world', this.world),
            {deep: true}
        );

        // move this to analytics.js
        this.$watch('world.location', () => {
            event.contextChange(this.world.location);
        });
        this.$watch(
            () => { return [...this.world.inventory] },
            (after, before) => {
                const added = after.filter(item => ! before.includes(item));
                const removed = before.filter(item => ! after.includes(item));
                added.forEach(item => event('inventory-item:' + item.name + '.take'));
                removed.forEach(item => event('inventory-item:' + item.name + '.drop'));
            }
        );
        this.onEvent(event);
    },
    destroyed() {
        window.removeEventListener('resize', this.resizer);
    },
    data() {
        return {
            config,
            isMobile: false,
            canvas: {
                width: 350,
                height: 255,
            },
            roomSize: {
                width: 350,
                height: 255,
            },
            inventorySize: {
                width: 350,
                height: 50,
            },
            storage,
            world,
            eventBus: new Vue(),
        };
    },
    computed: {
        viewport() {
            return {
                width: this.roomSize.width,
                height: this.roomSize.height + (this.world.inventory.length === 0 ? 0 : this.inventorySize.height),
            };
        },
    },
    watch: {
        'viewport.width': function () {
            this.resize();
        },
        'viewport.height': function () {
            this.resize();
        },
    },
    methods: {
        resize() {
            const parent = this.$el.parentNode;
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
            const adjustedHeight = this.canvas.width * this.viewport.height / this.viewport.width;
            const adjustedWidth = this.canvas.height * this.viewport.width / this.viewport.height;
            if (adjustedWidth < this.canvas.width) {
                this.canvas.width = adjustedWidth;
            }
            if (adjustedHeight < this.canvas.height) {
                this.canvas.height = adjustedHeight;
            }
        },
        event(...args) {
            this.$emit('event', ...args);
        },
        onEvent(callback) {
            this.$on('event', callback);
        },
    },
});
