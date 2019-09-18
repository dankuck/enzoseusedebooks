// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;

import EnzoText from './EnzoText.vue';
import EnzosEusedEbooks from './EnzosEusedEbooks.vue';

Vue.use(VueEaseljs);

Vue.component('enzo-text', EnzoText);

const app = new Vue({
    el: '#app',
    components: {
        EnzosEusedEbooks,
    },
    data() {
        return {
        };
    },
});
