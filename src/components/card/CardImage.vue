<script setup lang="ts">
const { id, name, image } = defineProps<{
	id?: number;
	name?: string;
	image?: string;
}>();
</script>

<template>
	<div class="card-illustration">
		<img v-if="image" :src="image" :alt="name" width="150" height="150" loading="lazy" />
		<img
			v-else
			:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(id).padStart(3, '0')}.png`"
			:alt="name"
			width="150"
			height="150"
			loading="lazy"
		/>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
</style>
