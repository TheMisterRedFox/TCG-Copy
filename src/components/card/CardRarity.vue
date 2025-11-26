<script setup lang="ts">
const { rarity } = defineProps<{
	rarity?: number;
}>();
</script>

<template>
	<!-- Card Rarity -->
	<div class="card-rarity">
		<span v-if="rarity === undefined"> ❔ </span>

		<!-- Common to Rare (0–3) -->
		<span v-else-if="rarity < 4">
			<span v-for="n in rarity + 1" :key="n">🔶</span>
		</span>

		<!-- Legendary -->
		<span v-else-if="rarity === 4">🌟</span>

		<!-- Shrek rarity -->
		<span v-else-if="rarity === 5"> 🤢</span>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
</style>
