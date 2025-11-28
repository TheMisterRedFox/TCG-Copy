<script setup lang="ts">
import { useEnergyIcon } from '@/composables/useEnergyIcon';
import type { WeaknessV2 } from '@/interfaces/GeneralTypes';

/**
 * Props
 * @property {string} type - The type of the card
 */
const { weakness } = defineProps<{
	weakness?: WeaknessV2;
}>();

const { iconStyle } = useEnergyIcon(weakness?.type, { width: 14, height: 14 });
</script>

<template>
	<div class="card-metadata-container card-weakness">
        <p class="card-weakness-label">
            Weakness
        </p>
        <div class="card-weakness-type">
            <i class="type-icon" :style="iconStyle" />
            <span class="card-weakness-type-value">
                {{ weakness?.value }}
            </span>
        </div>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-weakness {
    .card-weakness-label {
        font-size: 10px;
        font-weight: 700;
    }

    .card-weakness-type {
        display: flex;
        align-items: center;

        .card-weakness-type-value {
            font-size: 14px;
            font-weight: 800;
        }
    }
}
</style>
