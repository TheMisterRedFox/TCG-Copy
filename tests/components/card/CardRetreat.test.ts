import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardRetreat from '@/components/card/CardRetreat.vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardRetreat.vue', () => {
	it('renders retreat label correctly', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('colorless');

		const wrapper = mount(CardRetreat, {
			props: { type: 'colorless' },
		});

		expect(wrapper.text()).toContain('Retreat');
	});

	it('renders correctly when type is undefined', () => {
		const wrapper = mount(CardRetreat);

		expect(wrapper.text()).toContain('Retreat');

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);
	});

	it('applies correct energy icon background image', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('psychic');

		const wrapper = mount(CardRetreat, {
			props: { type: 'psychic' },
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		const style = icon.attributes('style');
		expect(style).toContain(
			'background-image: url("/img/energy/psychic-energy.png")',
		);
	});
});
