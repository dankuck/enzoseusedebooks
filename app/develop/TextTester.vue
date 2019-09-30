<template>
    <enzo-text
        :text="DevSettings.showText"
        :x="app.canvas.pixelWidth / 2 - 1"
        :y="app.canvas.pixelHeight / 2 - 1"
    >
    </enzo-text>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';

export default {
    inject: ['app'],
    data() {
        return {
            DevSettings,
        };
    }
}
</script>
