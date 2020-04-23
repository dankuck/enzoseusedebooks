<!--
/**
 |--------------------------
 | EnzoNamedContainer
 |--------------------------
 | Makes whatever is inside it have a name on the text layer.
 |
 | Use this when you want a visible item to have a name.
 |
 | Emits a `click` event.
 */
-->
<template>
    <easel-container
        :x="x"
        :y="y"
        :alpha="alpha"
        cursor="pointer"
        :cache="true"
        @click="$emit('click', $event)"
        @rollover="hover"
        @rollout="unhover"
    >
        <slot></slot>
    </easel-container>
</template>

<script>
import UsesTextLayer from '@textLayer/UsesTextLayer';

export default {
    mixins: [UsesTextLayer],
    props: {
        x: {},
        y: {},
        name: {},
        alpha: {
            default: 1,
        },
    },
};
</script>
