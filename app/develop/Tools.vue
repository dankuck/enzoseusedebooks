<template>
    <div style="position: absolute; width: 100%;">
        <button @click="showTools = !showTools" style="color: red">🛠️</button>
        <div v-if="showTools" style="background-color: white; width: 100%;">
            <div>
                <input type="checkbox" v-model="DevSettings.showPointsScreen" /> Show Points Screen
            </div>
        </div>
    </div>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';

export default {
    data() {
        return {
            showTools: false,
            DevSettings,
        };
    },
    methods: {
    },
};
</script>
