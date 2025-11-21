<script setup lang="ts">
const { id, name, image } = defineProps<{
	id?: number;
	name?: string;
	image?: string;
}>();
</script>

<template>
	<!-- Illustration -->
	<div class="card-illustration">
		<!-- If a custom image is provided -->
		<img v-if="image" :src="image" :alt="name" />

		<!-- Otherwise, fallback to the official pokedex image -->
		<img
			v-else
			:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(id).padStart(3, '0')}.png`"
			:alt="name"
		/>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
</style>
