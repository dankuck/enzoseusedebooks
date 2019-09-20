<template>
    <easel-container>
        <easel-shape
            form="rect"
            :dimensions="[pixelWidth, pixelHeight]"
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
            >
            </easel-text>
        </div>
    </easel-container>
</template>

<script>
import {pixelWidth, pixelHeight} from '@app/EnzosEusedEbooks';

export default {
    data() {
        return {
            pixelWidth,
            pixelHeight,
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
