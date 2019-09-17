// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;

Vue.use(VueEaseljs);

import EnzoText from './EnzoText.vue';

Vue.component('enzo-text', EnzoText);

import EnzosEusedEbooks from './EnzosEusedEbooks.vue';

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
