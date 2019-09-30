<template>
    <div>
        <points-screen
            v-if="DevSettings.showPointsScreen"
        >
        </points-screen>
        <text-tester
            v-if="DevSettings.showText"
        >
        </text-tester>
    </div>
</template>

<script>
import DevSettings from '@develop/DevSettings.js';
import PointsScreen from '@develop/PointsScreen'
import TextTester from '@develop/TextTester'

export default {
    components: {
        PointsScreen,
        TextTester,
    },
    data() {
        return {
            DevSettings,
        };
    },
};
</script>
