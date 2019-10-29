<template>
    <easel-container>
        <easel-shape
            form="rect"
            :dimensions="[app.viewport.width, app.viewport.height]"
            fill="black"
            alpha=".2"
            @click="addPoint"
        >
        </easel-shape>
        <div
            v-for="(point, index) in points"
            :key="index"
        >
            <easel-shape
                form="circle"
                :x="point.x"
                :y="point.y"
                dimensions=".5"
                fill="red"
            >
            </easel-shape>
            <easel-text
                :x="point.x + 1"
                :y="point.y"
                :text="'(' + point.x + ', ' + point.y + ')'"
                color="red"
                font="4px Arial"
                :shadow="['black', 0, 0, 3]"
                :align="['top', point.x > app.viewport.width / 2 ? 'right' : 'left']"
            >
            </easel-text>
        </div>
    </easel-container>
</template>

<script>
export default {
    inject: ['app'],
    data() {
        return {
            points: [],
        };
    },
    methods: {
        addPoint({viewportX, viewportY}) {
            this.points.push({
                x: Math.floor(viewportX),
                y: Math.floor(viewportY),
            });
        },
    },
};
</script>
