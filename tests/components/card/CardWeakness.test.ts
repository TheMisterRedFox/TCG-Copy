import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardWeakness from '@/components/card/CardWeakness.vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardWeakness.vue', () => {
	it('renders weakness label and value correctly', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardWeakness, {
			props: {
				weakness: {
					type: 'fire',
					value: '×2',
				},
			},
		});

		expect(wrapper.text()).toContain('Weakness');
		expect(wrapper.text()).toContain('x2');
	});

	it('renders correctly when weakness is undefined', () => {
		const wrapper = mount(CardWeakness);

		expect(wrapper.text()).toContain('Weakness');
		// value should not exist
		expect(wrapper.find('.card-weakness-type-value').text()).toBe('');
	});

	it('applies correct energy icon background image', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('water');

		const wrapper = mount(CardWeakness, {
			props: {
				weakness: {
					type: 'water',
					value: '+20',
				},
			},
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		const style = icon.attributes('style');
		expect(style).toContain(
			'background-image: url("/img/energy/water-energy.png")',
		);
	});
});
