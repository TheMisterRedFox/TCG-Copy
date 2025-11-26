<script setup lang="ts">
import type { Attack } from '@/interface/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';
import { computed } from 'vue';

const { attack } = defineProps<{
	attack: Attack;
}>();

const iconStyle = computed(() => {
	const transformedType = pokemonTypeTransform(attack.type || '').toLowerCase();

	return {
		width: '20px',
		height: '20px',
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
			<span :class="`type-${attack.type}`">
				<i
				class="type-icon"
				:style="iconStyle"
				></i>
			</span>
			<span class="attack-name">{{ attack.name }}</span> 
		</div>
		
		<span>
			{{ attack.power ?? '?' }} dmg
		</span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.attack {
	display: flex;
}

.attack-header {
	display: flex;
}

.attack-name {
	font-weight: bold;
	text-transform: capitalize;
}

.type-icon {
	display: inline-block;
	margin-right: 5px;
	vertical-align: middle;
}
</style>
