<script setup lang="ts">
import type { Attack } from '@/interface/GeneralTypes';

const { attack } = defineProps<{
	attack: Attack;
}>();
</script>

<template>
	<div class="attack" role="listitem">
		<span class="attack-name">{{ attack.name }}</span> - {{ attack.power ?? '?' }} dmg
		<span class="energy" v-for="(energy, i) in attack.energy" :key="i">{{ energy }}</span>
		<span :class="`type-${attack.type}`">{{ attack.type }}</span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
.attack-name {
	font-weight: bold;
	text-transform: capitalize;
}
</style>
