<template>
    <easel-container>
        <lobby></lobby>

        <easel-shape
            form="rect"
            :dimensions="[window.dimensions.width, window.dimensions.height]"
            :alpha="0.01"
            :x="0"
            :y="0"
            fill="black"
            @click.stop
        >
        </easel-shape>
    </easel-container>
</template>

<script>
import Lobby from '@app/Lobby';

export default {
    components: {
        Lobby,
    },
    inject: ['window'],
    mounted() {
        setTimeout(() => this.$emit('done'), 5000);
    },
}
</script>
