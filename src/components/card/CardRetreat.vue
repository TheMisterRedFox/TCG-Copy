<script setup lang="ts">
import { useEnergyIcon } from '@/composables/useEnergyIcon';

/**
 * Props
 * @property {string} type - The type of the card
 */
const { type } = defineProps<{
	type?: string;
}>();

const { iconStyle } = useEnergyIcon(type, { width: 14, height: 14 });
</script>

<template>
	<div class="card-metadata-container card-retreat">
        <p class="card-retreat-label">
            Retreat
        </p>
        <span class="card-retreat-type">
            <i class="type-icon" :style="iconStyle" />
        </span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-retreat {
    .card-retreat-label {
        font-size: 10px;
        font-weight: bold;
    }

    .card-retreat-type {
        display: flex;
        align-items: center;
    }
}
</style>
