import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import CardAttack from '@/components/card/CardAttack.vue';
import type { Attack } from '@/interface/GeneralTypes';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

// Mock the pokemonTypeTransform function
vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardAttack.vue', () => {
	const baseAttack: Attack = {
		name: 'Attack Name',
		power: 50,
		type: 'fire',
		energy: [],
	};

	it('mounts without errors', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(wrapper.exists()).toBe(true);
	});

	it('renders attack name and power', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('fire');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(wrapper.text()).toContain('Attack Name');
		expect(wrapper.text()).toContain('50');
	});

	it('calls pokemonTypeTransform with correct type', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('water');

		mount(CardAttack, {
			props: { attack: baseAttack },
		});

		expect(pokemonTypeTransform).toHaveBeenCalledWith('fire');
	});

	it('applies correct iconStyle background image', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('water');

		const wrapper = mount(CardAttack, {
			props: { attack: baseAttack },
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		const style = icon.attributes('style');
		expect(style).toContain(
			'background-image: url("/img/energy/water-energy.png")',
		);
		expect(style).toContain('width: 18px');
		expect(style).toContain('height: 18px');
	});

	it('shows power as 0 when null', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('normal');

		const wrapper = mount(CardAttack, {
			props: {
				attack: {
					...baseAttack,
					power: null,
				},
			},
		});

		expect(wrapper.text()).toContain('0');
	});
});
