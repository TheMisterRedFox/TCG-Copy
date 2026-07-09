import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Booster from '@/components/booster/Booster.vue';

const mountBooster = () =>
	mount(Booster, { global: { plugins: [createPinia()] } });

describe('Booster.vue', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it('mounts without errors', () => {
		const wrapper = mountBooster();
		expect(wrapper.exists()).toBe(true);
	});

	it('shows loading placeholders immediately after cutting, then reveals cards', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						moves: [],
						types: [{ type: { name: 'normal' } }],
						stats: [{ base_stat: 10, stat: { name: 'hp' } }],
					}),
			}),
		);

		const wrapper = mountBooster();

		await wrapper.find('.cut-line').trigger('click');
		await wrapper.vm.$nextTick();
		expect(wrapper.findAll('.card.loading').length).toBeGreaterThan(0);

		await flushPromises();
		expect(wrapper.findAll('.card.loading').length).toBe(0);
	});

	it('surfaces an error message when generation fails', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

		const wrapper = mountBooster();

		await wrapper.find('.cut-line').trigger('click');
		await flushPromises();

		expect(wrapper.find('.generation-error').exists()).toBe(true);
	});
});
