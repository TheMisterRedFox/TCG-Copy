<script setup lang="ts">
import { computed } from 'vue';
import type { Attack } from '@/interface/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

const { attack } = defineProps<{
	attack: Attack;
}>();

const iconStyle = computed(() => {
	const transformedType = pokemonTypeTransform(attack.type || '').toLowerCase();

	return {
		width: '18px',
		height: '18px',
		border: '1px solid #ffff',
		borderRadius: '25px',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('./img/energy/${transformedType}-energy.png')`,
	};
});
</script>

<template>
	<div class="attack" role="listitem">
		<div class="attack-header">
			<div class="attack-type-container" :class="`type-${attack.type}`">
				<i class="type-icon" :style="iconStyle" />
			</div>
			<span class="attack-name">{{ attack.name }}</span> 
		</div>
		<span>
			{{ attack.power ?? '0' }}
		</span>
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
	width: 72px;
}
</style>
