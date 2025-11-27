// src/composables/useEnergyIcon.ts
import { computed } from 'vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

/**
 * Generates the energy icon inline style
 * @param {string | undefined} rawType - The original Pokémon type
 * @param {object} size - Pixel size of the icon
 * @returns {{ iconStyle: ComputedRef<Record<string, string>> }}
 */
export const useEnergyIcon = (
	rawType: string | undefined,
	size: { width: number; height: number },
) => {
	const iconStyle = computed(() => {
		const transformed = pokemonTypeTransform(rawType || '');

		return {
			width: `${size.width}px`,
			height: `${size.height}px`,
			border: '1px solid #ffff',
			borderRadius: '25px',
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			backgroundImage: `url('/img/energy/${transformed}-energy.png')`,
		};
	});

	return { iconStyle };
};
