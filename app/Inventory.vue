<template>
    <easel-container
        :x="x"
        :y="y"
    >
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
    },
};
</script>
