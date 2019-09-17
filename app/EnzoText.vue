<template>
    <easel-text
        :text="text"
        :x="x"
        :y="y"
        :align="align"
        color="#5b5b89"
        :shadow="['#CCF', 1, 1, 1]"
        font="10px 'Press Start 2P'"
    >
    </easel-text>
</template>

<script>
export default {
    props: [
        'text',
        'align',
        'x',
        'y',
    ],
};
</script>
