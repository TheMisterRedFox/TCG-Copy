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
	<div class="card-metadata-container card-weakness">
        <p class="card-weakness-label">
            Weakness
        </p>
        <span class="card-weakness-type">
            <i class="type-icon" :style="iconStyle" />
        </span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-weakness {
    .card-weakness-label {
        font-size: 10px;
        font-weight: bold;
    }

    .card-weakness-type {
        display: flex;
        align-items: center;
    }
}
</style>
