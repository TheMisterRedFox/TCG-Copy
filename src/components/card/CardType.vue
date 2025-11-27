<script setup lang="ts">
import { useEnergyIcon } from '@/composables/useEnergyIcon';

/**
 * Props
 * @property {number} hp - The HP value of the card
 * @property {string} type - The type of the card
 */
const { hp, type } = defineProps<{
	hp?: number;
	type?: string;
}>();

const { iconStyle } = useEnergyIcon(type, { width: 20, height: 20 });
</script>

<template>
  <div class="card-type">
	<p class="hp">
		<span>HP</span>
		{{ hp ?? '0' }}
	</p>

	<!-- Type energy icon -->
    <i class="type-icon" :style="iconStyle" />
  </div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-type {
  position: absolute;
  top: 4px;
  right: 10px;
  display: flex;
  text-shadow: none;
}

.type-icon {
  display: inline-block;
}

.hp {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  margin-right: 4px;

  span {
	font-size: 8px;
	font-weight: normal;
	margin-bottom: 2px;
  }
}
</style>
