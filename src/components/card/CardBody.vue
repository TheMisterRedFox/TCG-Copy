<script setup lang="ts"></script>

<template>
	<div class="card-body">
		<slot />
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
}
</style>
