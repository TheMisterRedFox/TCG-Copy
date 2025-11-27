<script setup lang="ts">
import { computed } from 'vue';
import type { Attack } from '@/interface/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

/**
 * Props
 * @property {Attack} attack - The attack data to display
 */
const { attack } = defineProps<{
	attack: Attack;
}>();

/**
 * Computes the inline style for the energy icon displayed next to the attack name
 *
 * - Calls `pokemonTypeTransform` to normalize the type (e.g. "Bird" → "normal")
 * - Builds the final image URL from `/public/img/energy/...`
 * - Ensures consistent size, border and rendering of the icon
 */
const iconStyle = computed(() => {
	const transformedType = pokemonTypeTransform(attack.type || '');

	return {
		width: '15px',
		height: '15px',
		border: '1px solid #ffff',
		marginRight: '1px',
		borderRadius: '25px',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('/img/energy/${transformedType}-energy.png')`,
	};
});
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
}

.attack-type-container {
	width: 75px;
	display: flex;
	align-items: center;
}
</style>
