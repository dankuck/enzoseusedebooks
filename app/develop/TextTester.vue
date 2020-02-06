<template>
    <enzo-text
        :text="DevSettings.showText"
        :x="1"
        :y="1"
    >
    </enzo-text>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';

export default {
    data() {
        return {
            DevSettings,
        };
    }
}
</script>
