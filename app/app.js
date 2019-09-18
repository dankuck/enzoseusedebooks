// Expose these variables for devtools
window.Vue = require('vue');
window.VueEaseljs = require('vue-easeljs');
window.easeljs = window.VueEaseljs.easeljs;

import EnzoText from '@app/EnzoText.vue';
import EnzoClickSpot from '@app/EnzoClickSpot.vue';
import EnzosEusedEbooks from '@app/EnzosEusedEbooks.vue';

Vue.use(VueEaseljs);

Vue.component('enzo-text', EnzoText);
Vue.component('enzo-click-spot', EnzoClickSpot);

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
