<!--
/**
 |---------------------------------
 | FictionStack
 |---------------------------------
 | This component is a visual context.
 |
 | It provides TextLayer tools, shows a GIF background, and has click spots for
 | emitting events up to EnzosEusedEbooks.
 */
-->

<template>
    <stack
        backgground="bookcase2-back.gif"
        foreground="bookcase2-front.gif"
        :collection="app.world.collections.fiction"
        :shelves="[
            [10, 300, 66, 69],
            [11, 349, 118, 118],
            [40, 349, 169, 162],
            [13, 349, 214, 209],
            [14, 349, 260, 255],
        ]"
    >
    </stack>
</template>

<script>
import Stack from '@app/Stack';

export default {
    components: {
        Stack,
    },
    inject: ['app'],
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
};
</script>
