<script setup lang="ts">
import { useEnergyIcon } from '@/composables/useEnergyIcon';
import type { AttackV2 } from '@/interfaces/GeneralTypes';

/**
 * Props
 * @property {Attack} attack - The attack data to display
 */
const { attack } = defineProps<{
	attack: AttackV2;
}>();

const attackCostEnergy = attack.cost.map((costType) => {
	const { iconStyle } = useEnergyIcon(costType, { width: 15, height: 15 });
	return iconStyle;
});
</script>

<template>
	<div class="attack" role="listitem">
		<div class="attack-header">
			<!-- Attack type container -->
			<div class="attack-type-container">
				<i class="type-icon" v-for="(energy, i) in attackCostEnergy" :key="i" :style="energy.value" />
			</div>

			<!-- Attack name -->
			<span class="attack-name">{{ attack.name }}</span> 
		</div>

		<!-- Attack power -->
		<span>{{ attack.damage }}</span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.attack {
	display: flex;
	justify-content: space-between;
}

.attack-header {
	display: flex;
	align-items: center;
}

.attack-name {
	font-weight: bold;
	text-transform: capitalize;
}

.type-icon {
	display: inline-block;
	vertical-align: middle;
	margin-right: 1px;
}

.attack-type-container {
	width: 75px;
	display: flex;
	align-items: center;
}
</style>
