import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardType from '@/components/card/CardType.vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardType.vue', () => {
	it('renders HP correctly', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('water');

		const wrapper = mount(CardType, {
			props: { hp: 120, type: 'water' },
		});

		expect(wrapper.text()).toContain('HP');
		expect(wrapper.text()).toContain('120');
	});

	it('renders default HP = 0 when hp is undefined', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardType, {
			props: { type: 'fire' },
		});

		expect(wrapper.text()).toContain('0');
	});

	it('applies correct background image', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('grass');

		const wrapper = mount(CardType, {
			props: { hp: 60, type: 'grass' },
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		const style = icon.attributes('style');
		expect(style).toContain(
			'background-image: url("/img/energy/grass-energy.png")',
		);
	});
});
