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
            @click="scrollLeft(handleWidth)"
        >
            <easel-shape
                form="rect"
                :dimensions="[handleWidth, app.viewport.height]"
                fill="black"
            >
            </easel-shape>
        </enzo-hover-spot>

        <enzo-hover-spot
            v-if="x < maxX"
            :speed="8"
            :x="app.viewport.width - handleWidth"
            :y="0"
            @hovering="scrollRight"
            @click="scrollRight(handleWidth)"
        >
            <easel-shape
                form="rect"
                :dimensions="[handleWidth, app.viewport.height]"
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
            return 0.15 * this.app.viewport.width;
        },
        maxX() {
            return this.width - this.app.viewport.width;
        },
    },
    methods: {
        scrollLeft(amount = 4) {
            this.x -= amount;
            if (this.x < 0) {
                this.x = 0;
            }
        },
        scrollRight(amount = 4) {
            this.x += amount;
            if (this.x > this.maxX) {
                this.x = this.maxX;
            }
        },
    },
};
</script>
