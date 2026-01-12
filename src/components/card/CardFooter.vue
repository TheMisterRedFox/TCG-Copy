<script setup lang="ts"></script>

<template>
	<div class="card-footer">
		<slot />
	</div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-footer {
	display: flex;
	justify-content: space-between;
}
</style>
