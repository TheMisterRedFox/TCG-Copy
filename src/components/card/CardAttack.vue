<script setup lang="ts">
import { useEnergyIcon } from '@/composables/useEnergyIcon';
import type { Attack } from '@/interface/GeneralTypes';

/**
 * Props
 * @property {Attack} attack - The attack data to display
 */
const { attack } = defineProps<{
	attack: Attack;
}>();

const { iconStyle } = useEnergyIcon(attack.type, { width: 15, height: 15 });
</script>

<template>
	<div class="attack" role="listitem">
		<div class="attack-header">
			<!-- Attack type container -->
			<div class="attack-type-container" :class="`type-${attack.type}`">
				<i class="type-icon" :style="iconStyle" v-for="energy in attack.energy" />
			</div>

			<!-- Attack name -->
			<span class="attack-name">{{ attack.name }}</span> 
		</div>

		<!-- Attack power -->
		<span>{{ attack.power ?? '0' }}</span>
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
