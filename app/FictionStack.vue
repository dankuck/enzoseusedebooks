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

    <stack-room
        name="fiction"
        width="400"
        :start-x="10"
        background-image="images/bookcase2-back.gif"
        :collection="app.world.collections.fiction"
        :shelves="[
            [10 + 25, 300 + 25, 66, 69],
            [11 + 25, 349 + 25, 118, 118],
            [40 + 25, 349 + 25, 169, 162],
            [13 + 25, 349 + 25, 214, 209],
            [14 + 25, 349 + 25, 260, 255],
        ]"
        align="left"
        bookcase-image="images/bookcase2-front.gif"
        shadow-image="images/bookcase2-shadow.gif"
        lobby-side="left"
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
