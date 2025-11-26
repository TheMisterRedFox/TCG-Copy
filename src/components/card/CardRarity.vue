<script setup lang="ts">
const { rarity } = defineProps<{
	rarity?: number;
}>();
</script>

<template>
	<div class="card-rarity">
		<span v-if="rarity === undefined"> ❔ </span>
		<span v-else-if="rarity < 4">
			<span v-for="n in rarity + 1" :key="n">🔶</span>
		</span>
		<span v-else-if="rarity === 4">🌟</span>
		<span v-else-if="rarity === 5"> 🤢</span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
</style>
