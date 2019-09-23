/**
 |---------------------------------
 | app.js
 |---------------------------------
 | This is the root of the whole app.
 |
 | It handles screen sizing, being a parent to other components, and providing
 | globally useful tools such as `isMobile`, canvas size, and config.
 |
 | It does NOT handle rendering anything directly or choosing which components
 | are rendered. That's left to the EnzosEusedEbooks component.
 */

// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;

import EnzoText from '@app/EnzoText.vue';
import EnzoClickSpot from '@app/EnzoClickSpot.vue';
import EnzosEusedEbooks from '@app/EnzosEusedEbooks.vue';
import config from '@/config';

Vue.use(VueEaseljs);

Vue.component('enzo-text', EnzoText);
Vue.component('enzo-click-spot', EnzoClickSpot);

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
        };
    },
});
