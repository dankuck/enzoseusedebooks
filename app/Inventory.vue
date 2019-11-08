<template>
    <easel-container
        :x="x"
        :y="y"
    >
        <easel-shape
            form="rect"
            :dimensions="[app.inventorySize.width, app.inventorySize.height]"
            fill="black"
        >
        </easel-shape>

        <inventory-item
            v-for="(item, index) in items"
            :key="item.name"
            :x="index * itemSize"
            :y="0"
            v-bind="item"
            :size="itemSize"
        >
        </inventory-item>

        <text-layer>
        </text-layer>
    </easel-container>
</template>

<script>
import InventoryItem from '@app/InventoryItem';
import HasTextLayer from '@textLayer/HasTextLayer';
import TextLayer from '@textLayer/TextLayer';

export default {
    mixins: [HasTextLayer],
    components: {
        InventoryItem,
        TextLayer,
    },
    inject: ['app'],
    provide() {
        return {
            window: this,
        };
    },
    props: ['x', 'y', 'items'],
    data() {
        return {
            noMobileHoverRing: true,
        };
    },
    computed: {
        itemSize() {
            return this.app.inventorySize.height;
        },
        dimensions() {
            return {
                x: 0,
                y: 0,
                width: this.app.inventorySize.width,
                height: this.app.inventorySize.height,
            };
        },
    },
};
</script>
