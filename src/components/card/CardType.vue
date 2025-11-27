<script setup lang="ts">
import { computed } from 'vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

const { type } = defineProps<{
	type?: string;
}>();

const iconStyle = computed(() => {
	const transformedType = pokemonTypeTransform(type || '');

	return {
		width: '20px',
		height: '20px',
		border: '1px solid #ffff',
		borderRadius: '25px',
		backgroundSize: 'contain',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('/img/energy/${transformedType}-energy.png')`,
	};
});
</script>

<template>
  <div class="card-type">
    <i class="type-icon" :style="iconStyle"></i>
  </div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-type {
  position: absolute;
  top: 4px;
  right: 10px;
}

.type-icon {
  display: inline-block;
}
</style>
