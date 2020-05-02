<!--
/**
 |---------------------------------
 | ChildrenStack
 |---------------------------------
 | This component is a visual context.
 |
 | It provides TextLayer tools, shows a GIF background, and has click spots for
 | emitting events up to EnzosEusedEbooks.
 */
-->

<template>

    <stack-room
        name="children"
        width="400"
        :start-x="(400 - window.dimensions.width) - 10"
        background-image="images/bookcase3-back.gif"
        :collection="app.world.collections.children"
        :shelves="[
            [0 + 25, 350 - 14 + 25, 255, 260],
            [0 + 25, 350 - 13 + 25, 209, 214],
            [0 + 25, 350 - 12 + 25, 162, 169],
            [0 + 25, 350 - 11 + 25, 118, 118],
            [0 + 25, 350 - 10 + 25, 69, 66],
        ]"
        align="right"
        bookcase-image="images/bookcase3-front.gif"
        shadow-image="images/bookcase3-shadow.gif"
        lobby-side="right"
    >
    </stack-room>

</template>

<script>
import StackRoom from '@app/StackRoom';

export default {
    components: {
        StackRoom,
    },
    inject: ['app', 'window'],
};
</script>
