import { describe, expect, it, vi } from 'vitest';
import { useEnergyIcon } from '@/composables/useEnergyIcon';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

// Mock the transform fn
vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('useEnergyIcon', () => {
	it('returns correct style object', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const { iconStyle } = useEnergyIcon('Fire', { width: 20, height: 20 });

		expect(iconStyle.value.backgroundImage).toBe(
			"url('/img/energy/fire-energy.png')",
		);

		expect(iconStyle.value.width).toBe('20px');
		expect(iconStyle.value.height).toBe('20px');
	});

	it('handles empty type safely', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue(
			'normal',
		);

		const { iconStyle } = useEnergyIcon(undefined, { width: 15, height: 15 });

		expect(iconStyle.value.backgroundImage).toBe(
			"url('/img/energy/normal-energy.png')",
		);
	});
});
