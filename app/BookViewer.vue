<template>
    <easel-container>
        <easel-shape
            form="rect"
            x="0"
            y="0"
            :dimensions="[app.canvas.pixelWidth, app.canvas.pixelHeight]"
            fill="black"
            alpha=".5"
            @click="$emit('close')"
        >
        </easel-shape>

        <easel-bitmap
            :image="book.image.url"
            :x="app.canvas.pixelWidth / 2 - 6"
            :y="app.canvas.pixelHeight / 2"
            align="center-right"
            :x-filters="[['ColorReducer', 4]]"
        >
        </easel-bitmap>

        <enzo-text
            :text="description"
            :x="app.canvas.pixelWidth / 2 - 1"
            :y="app.canvas.pixelHeight / 2 - book.image.height / 2"
        >
        </enzo-text>

        <easel-shape
            :x="app.canvas.pixelWidth / 2 - 2"
            :y="app.canvas.pixelHeight / 2 + book.image.height / 2"
            form="rect"
            fill="grey"
            :dimensions="[130, 10]"
            align="bottom-left"
            @click="goToAmazon"
            cursor="pointer"
        >
        </easel-shape>

        <enzo-text
            text="Buy It On Amazon"
            :x="app.canvas.pixelWidth / 2 - 1"
            :y="app.canvas.pixelHeight / 2 + book.image.height / 2"
        >
        </enzo-text>

    </easel-container>
</template>

<script>
export default {
    inject: ['app'],
    props: ['book'],
    computed: {
        description() {
            const lines = [];
            lines.push(this.book.title);
            if (this.book.by.length === 1) {
                lines.push('by ' + this.book.by[0]);
            } else if (this.book.by.length > 1) {
                lines.push('by ' + this.book.by[0] + ' and others');
            }
            return lines.join("\n");
        },
    },
    methods: {
        goToAmazon() {
            window.open(this.book.url, '_blank');
        },
    },
};
</script>
