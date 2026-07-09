import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Only a single, rarity-0 card is available. Any rarity roll must fall back
// to it instead of crashing, since pickRandomCard's tier search widens
// outward from whatever rarity was rolled.
vi.mock('@/assets/pokemon.json', () => ({
	default: [{ id: 10, name: 'Caterpie', rarity: 0 }],
}));

import Booster from '@/components/booster/Booster.vue';

describe('Booster.vue rarity fallback', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it('falls back to the only available card when the rolled rarity tier is empty', async () => {
		// roll = 99.9 -> the highest rarity tier (5), which has no cards here
		vi.spyOn(Math, 'random').mockReturnValue(0.999);
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						moves: [],
						types: [{ type: { name: 'bug' } }],
						stats: [{ base_stat: 45, stat: { name: 'hp' } }],
					}),
			}),
		);

		const wrapper = mount(Booster, {
			global: { plugins: [createPinia()] },
		});

		await wrapper.find('.cut-line').trigger('click');
		await flushPromises();

		expect(wrapper.findAll('.card').length).toBe(5);
		expect(wrapper.findAll('.card-10').length).toBe(5);
		expect(wrapper.text()).toContain('Caterpie');
	});
});
