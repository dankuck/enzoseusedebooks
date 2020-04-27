<template>
    <easel-container>
        <easel-shape
            form="rect"
            x="0"
            y="0"
            :dimensions="[window.dimensions.width, window.dimensions.height]"
            fill="black"
            alpha=".5"
            @click="$emit('close')"
        >
        </easel-shape>

        <easel-bitmap
            v-if="imageLoaded"
            :image="bookImage"
            :x="window.dimensions.width / 2 - 6"
            :y="window.dimensions.height / 2"
            align="center-right"
            :filters="[['ColorReducer', 6]]"
        >
        </easel-bitmap>

        <enzo-text
            :text="description"
            :x="window.dimensions.width / 2 - 1"
            :y="window.dimensions.height / 2 - book.image.height / 2"
        >
        </enzo-text>

        <easel-shape
            :x="window.dimensions.width / 2 - 2"
            :y="window.dimensions.height / 2 + book.image.height / 2"
            form="rect"
            fill="grey"
            :dimensions="[130, 10]"
            align="bottom-left"
            @click="goToAmazon"
            cursor="pointer"
            alpha="0.01"
        >
        </easel-shape>

        <enzo-text
            text="> Buy It On Amazon"
            :x="window.dimensions.width / 2 - 1"
            :y="window.dimensions.height / 2 + book.image.height / 2"
        >
        </enzo-text>

    </easel-container>
</template>

<script>
const priceValue = price => parseFloat(price.replace(/[^\d\.]/, ''));

export default {
    inject: ['app', 'window'],
    props: ['book'],
    mounted() {
        this.bookImage; // cause a load
        this.app.event('book', 'view');
        this.app.world.markBookViewed(this.book.title);
    },
    data() {
        return {
            imageLoaded: false,
        };
    },
    computed: {
        description() {
            const lines = [];
            lines.push(this.book.title);
            lines.push(this.byLine + (this.publishedYear ? ', ' + this.publishedYear : ''));
            lines.push('');
            if (this.lastPrice) {
                lines.push('Last Price: ' + this.lastPriceDescription);
            }
            return lines.join("\n");
        },
        bookImage() {
            this.imageLoaded = false;
            const img = new Image();
            img.src = this.book.image.url;
            img.crossOrigin = 'Anonymous';
            img.addEventListener('load', () => this.imageLoaded = true);
            return img;
        },
        byLine() {
            return 'by ' + this.book.by[0] + (this.book.by.length > 1 ? ' and others' : '');
        },
        lastPrice() {
            return Object.values(this.book.prices || {})
                .reduce(
                    (bestPrice, price) =>
                        bestPrice === null || priceValue(price) < priceValue(bestPrice)
                            ? price
                            : bestPrice,
                    null
                );
        },
        lastPriceDescription() {
            if (!this.lastPrice) {
                return '???';
            } else {
                return this.lastPrice;
            }
        },
        publishedYear() {
            if (this.book.published_at) {
                return new Date(this.book.published_at).getFullYear();
            } else {
                return null;
            }
        },
    },
    methods: {
        goToAmazon() {
            this.app.event('book', 'amazon-visit');
            window.open(this.book.url, '_blank');
        },
    },
};
</script>
