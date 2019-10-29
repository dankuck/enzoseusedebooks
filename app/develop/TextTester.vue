<template>
    <enzo-text
        :text="DevSettings.showText"
        :x="app.viewport.width / 2 - 1"
        :y="app.viewport.height / 2 - 1"
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
