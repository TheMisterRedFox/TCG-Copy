import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardAttack from '@/components/card/CardAttack.vue';
import type { Attack } from '@/interface/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardAttack.vue', () => {
	const baseAttack: Attack = {
		name: 'Flame Shot',
		power: 50,
		type: 'fire',
		energy: ['e1', 'e2'],
	};

	it('renders attack name & power', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(wrapper.text()).toContain('Flame Shot');
		expect(wrapper.text()).toContain('50');
	});

	it('renders one energy icon per attack.energy entry', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		const icons = wrapper.findAll('.type-icon');
		expect(icons.length).toBe(2);
	});

	it('applies correct background image', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('water');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		expect(icon.attributes('style')).toContain(
			'background-image: url("/img/energy/water-energy.png")',
		);
	});

	it('shows default power = 0 if power is null', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: { ...baseAttack, power: null } },
		});

		expect(wrapper.text()).toContain('0');
	});
});
