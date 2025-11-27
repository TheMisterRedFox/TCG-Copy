import { mount } from '@vue/test-utils';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import CardType from '@/components/card/CardType.vue';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

// Mock type transform
vi.mock('@/utils/pokemonTypeTransform', () => ({
	pokemonTypeTransform: vi.fn(),
}));

describe('CardType.vue', () => {
	it('mounts correctly', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('fire');

		const wrapper = mount(CardType, {
			props: { hp: 100, type: 'fire' },
		});

		expect(wrapper.exists()).toBe(true);
	});

	it('renders HP correctly', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('fire');

		const wrapper = mount(CardType, {
			props: { hp: 120, type: 'fire' },
		});

		expect(wrapper.text()).toContain('120');
		expect(wrapper.text()).toContain('HP');
	});

	it('falls back to HP = 0 when hp is null', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('water');

		const wrapper = mount(CardType, {
			props: { hp: undefined, type: 'water' },
		});

		expect(wrapper.text()).toContain('0');
	});

	it('calls pokemonTypeTransform with correct type', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('grass');

		mount(CardType, {
			props: { hp: 90, type: 'grass' },
		});

		expect(pokemonTypeTransform).toHaveBeenCalledWith('grass');
	});

	it('applies correct background image for type', () => {
		(pokemonTypeTransform as Mock).mockReturnValue('electric');

		const wrapper = mount(CardType, {
			props: { hp: 50, type: 'electric' },
		});

		const icon = wrapper.find('.type-icon');
		expect(icon.exists()).toBe(true);

		const style = icon.attributes('style');

		expect(style).toContain(
			'background-image: url("/img/energy/electric-energy.png")',
		);
		expect(style).toContain('width: 20px');
		expect(style).toContain('height: 20px');
	});
});
