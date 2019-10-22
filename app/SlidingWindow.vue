<template>
    <easel-container>
        <easel-container
            :x="-x"
        >
            <slot />
        </easel-container>

        <enzo-hover-spot
            v-if="x > 0"
            :speed="8"
            :x="0"
            :y="0"
            @hovering="scrollLeft"
        >
            <easel-shape
                form="rect"
                :dimensions="[20, app.canvas.pixelHeight]"
                fill="black"
            >
            </easel-shape>
        </enzo-hover-spot>

        <enzo-hover-spot
            v-if="x < maxX"
            :speed="8"
            :x="app.canvas.pixelWidth - 20"
            :y="0"
            @hovering="scrollRight"
        >
            <easel-shape
                form="rect"
                :dimensions="[20, app.canvas.pixelHeight]"
                fill="black"
            >
            </easel-shape>
        </enzo-hover-spot>
    </easel-container>
</template>

<script>
export default {
    inject: ['app'],
    props: ['width', 'startX'],
    data() {
        return {
            x: parseInt(this.startX),
        };
    },
    computed: {
        handleWidth() {
            return 0.15 * this.app.canvas.pixelWidth;
        },
        maxX() {
            return this.width - this.app.canvas.pixelWidth;
        },
    },
    methods: {
        scrollLeft() {
            this.x -= 4;
            if (this.x < 0) {
                this.x = 0;
            }
        },
        scrollRight() {
            this.x += 4;
            if (this.x > this.maxX) {
                this.x = this.maxX;
            }
        },
    },
};
</script>
