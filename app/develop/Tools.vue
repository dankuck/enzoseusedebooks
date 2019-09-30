<template>
    <div style="position: absolute; width: 100%;">
        <button @click="showTools = !showTools" style="color: red">🛠️</button>
        <div v-if="showTools" style="background-color: white; width: 100%;">
            <div>
                <input type="checkbox" v-model="DevSettings.showPointsScreen" /> Show Points Screen
            </div>
            <div>
                <input type="checkbox" v-model="DevSettings.showClickSpots" /> Show Click Spots
            </div>
            <div>
                <button @click="resetWorld">Reset World</button>
            </div>
            <div>
                Show Text <input v-model="DevSettings.showText" />
            </div>
        </div>
    </div>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';
import World from '@world/World';

export default {
    inject: ['app'],
    data() {
        return {
            showTools: false,
            DevSettings,
        };
    },
    methods: {
        resetWorld() {
            if (confirm('Really reset world to default?')) {
                this.app.world = new World();
            }
        },
    },
};
</script>
