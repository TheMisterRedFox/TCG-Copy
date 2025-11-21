<script setup lang="ts">
const { name } = defineProps<{
	name?: string;
}>();
</script>

<template>
	<!-- Card Header -->
	<div class="card-header">
		<p class="card-name">
			{{ name || 'Loading…' }}
		</p>
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';
</style>
