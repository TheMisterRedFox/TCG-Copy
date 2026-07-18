import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CardAttack from '@/components/card/CardAttack.vue';
import type { Attack } from '@/interfaces/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardAttack.vue', () => {
	const baseAttack: Attack = {
		name: 'Flame Shot',
		damage: 50,
		cost: ['e1', 'e2'],
	};

	it('renders attack name and damage', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(wrapper.text()).toContain('Flame Shot');
		expect(wrapper.text()).toContain('50');
	});

	it('renders one energy icon per attack cost entry', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		const icons = wrapper.findAll('.type-icon');
		expect(icons.length).toBe(baseAttack.cost?.length);
	});

	it('applies correct energy icon background image', () => {
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

	it('renders attack effect when provided', () => {
		(pokemonTypeTransform as ReturnType<typeof vi.fn>).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: {
				attack: {
					...baseAttack,
					effect: 'Burn the opponent',
				},
			},
		});

		const effect = wrapper.find('.attack-effect');
		expect(effect.exists()).toBe(true);
		expect(effect.text()).toBe('Burn the opponent');
	});

	it('does not render effect container when no effect is provided', () => {
		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(wrapper.find('.attack-effect-container').exists()).toBe(false);
	});
});
