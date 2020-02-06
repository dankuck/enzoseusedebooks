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
                :dimensions="[handleWidth, dimensions.height]"
                fill="black"
            >
            </easel-shape>
        </enzo-hover-spot>

        <enzo-hover-spot
            v-if="x < maxX"
            :speed="8"
            :x="dimensions.width - handleWidth"
            :y="0"
            @hovering="scrollRight"
            @click="scrollRight(handleWidth)"
        >
            <easel-shape
                form="rect"
                :dimensions="[handleWidth, dimensions.height]"
                fill="black"
            >
            </easel-shape>
        </enzo-hover-spot>
    </easel-container>
</template>

<script>
export default {
    inject: {
        parentWindow: {from: 'window'},
    },
    provide() {
        return {
            window: this,
        };
    },
    props: ['width', 'startX'],
    data() {
        return {
            x: parseInt(this.startX),
        };
    },
    computed: {
        handleWidth() {
            return 0.15 * this.dimensions.width;
        },
        maxX() {
            return this.width - this.dimensions.width;
        },
        dimensions() {
            return {
                x: this.x,
                y: this.parentWindow.dimensions.y,
                width: this.parentWindow.dimensions.width,
                height: this.parentWindow.dimensions.height,
            };
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
