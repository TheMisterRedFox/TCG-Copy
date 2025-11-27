<script setup lang="ts">
import { computed } from 'vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

/**
 * Props
 * @property {number} hp - The HP value of the card
 * @property {string} type - The type of the card
 */
const { hp, type } = defineProps<{
	hp?: number;
	type?: string;
}>();

/**
 * Computes the style for the type icon based on the Pokémon type
 * - Calls `pokemonTypeTransform` to normalize the type (e.g. "Bird" → "normal")
 * - Builds the final image URL from `/public/img/energy/...`
 * - Ensures consistent size, border and rendering of the icon
 * @returns {Record<string, string>} The inline style object for <i class="type-icon" />
 */
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
	<p class="hp">
		<span>HP</span>
		{{ hp ?? '0' }}
	</p>

	<!-- Type energy icon -->
    <i class="type-icon" :style="iconStyle" />
  </div>
</template>

<style lang="less" scoped>
@import '../card/Card.less';

.card-type {
  position: absolute;
  top: 4px;
  right: 10px;
  display: flex;
}

.type-icon {
  display: inline-block;
}

.hp {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  margin-right: 4px;

  span {
	font-size: 8px;
	font-weight: normal;
	margin-bottom: 2px;
  }
}
</style>
