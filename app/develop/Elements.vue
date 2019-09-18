<template>
    <div>
        <points-screen
            v-if="DevSettings.showPointsScreen"
        >
        </points-screen>
    </div>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';
import PointsScreen from '@develop/PointsScreen'

export default {
    components: {
        PointsScreen,
    },
    data() {
        return {
            DevSettings,
        };
    },
};
</script>
