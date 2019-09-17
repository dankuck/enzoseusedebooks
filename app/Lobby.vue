<template>
    <easel-container>
        <easel-bitmap
            image="lobby.gif"
        >
        </easel-bitmap>
        <big-plant
            x="330"
            y="160"
            @shake="checkPlant"
        >
        </big-plant>
        <notifications></notifications>
    </easel-container>
</template>

<script>
import BigPlant from './BigPlant';
import Notifications from './Notifications';

export default {
    components: {
        BigPlant,
        Notifications,
    },
    data() {
        return {
            plant: {
                animation: 'rest',
            },
        };
    },
    methods: {
        checkPlant() {
            Notifications.queue({
                text: 'The plant is messy now',
                x: 330,
                y: 100,
            });
        },
    },
};
</script>
