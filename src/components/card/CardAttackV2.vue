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
		<div class="attack-header-container">
			<div class="attack-name-container">
				<!-- Attack type container -->
				<div class="attack-type-container">
					<i class="type-icon" v-for="(energy, i) in attackCostEnergy" :key="i" :style="energy.value" />
				</div>
				
				<!-- Attack name -->
				<span class="attack-name">{{ attack.name }}</span>
			</div>

			<!-- Attack power -->
			<span class="attack-damage">{{ attack.damage }}</span>
		</div>

		<div v-if="attack.effect" class="attack-effect-container">
			<!-- Attack effect -->
			<span class="attack-effect">{{ attack.effect }}</span>
		</div>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.attack {
	display: flex;
	flex-direction: column;

	.attack-header-container {
		display: flex;
		justify-content: space-between;
		width: 100%;

		.attack-name-container {
			display: flex;

			.attack-type-container {
				width: 75px;
				display: flex;
				align-items: center;

				.type-icon {
					display: inline-block;
					vertical-align: middle;
					margin-right: 1px;
				}
			}

			.attack-name {
				font-weight: bold;
				text-transform: capitalize;
			}
		}
	}

	.attack-effect-container {
		margin-top: -5px;
		
		.attack-effect {
			font-size: 0.8em;
			font-weight: 200;
		}
	}
}
</style>
