<template>
    <easel-container>
        <component :is="vModel" @done="vModel = null"></component>

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
import DoorbellCutscene from '@app/DoorbellCutscene';
import VModelMixin from '@app/VModelMixin';

export default {
    mixins: [
        VModelMixin,
    ],
    components: {
        doorbell: DoorbellCutscene,
    },
    inject: ['window'],
}
</script>
