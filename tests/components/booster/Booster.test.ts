import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Booster from '@/components/booster/Booster.vue';
import { setCached } from '@/utils/persistentCache';

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

	it('skips re-fetching a pokemon whose data is already in the persistent cache', async () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		setCached('pokeapi-pokemon', '10', {
			name: 'Caterpie',
			types: [{ type: { name: 'bug' } }],
			weight: 29,
			height: 3,
			abilities: [],
			moves: [],
			stats: [{ base_stat: 45, stat: { name: 'hp' } }],
		});
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		const wrapper = mountBooster();
		await wrapper.find('.cut-line').trigger('click');
		await flushPromises();

		const pokeApiCalls = fetchMock.mock.calls.filter(([url]) =>
			String(url).includes('pokeapi.co'),
		);
		expect(pokeApiCalls).toHaveLength(0);
		expect(wrapper.text()).toContain('Caterpie');
	});

	it('resets navigation state when redoing the booster', async () => {
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
		await flushPromises();

		for (const card of wrapper.findAll('.card')) {
			await card.trigger('click');
		}
		expect(wrapper.find('.booster-button').exists()).toBe(true);

		await wrapper.find('.booster-button').trigger('click');

		expect(wrapper.find('.booster-container').classes()).not.toContain(
			'cutted',
		);
		expect(wrapper.find('.booster-button').exists()).toBe(false);
		expect(wrapper.findAll('.card.clicked').length).toBe(0);
	});

	it('activates the focused card via Enter/Space, matching a click on it', async () => {
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

		const wrapper = mount(Booster, {
			global: { plugins: [createPinia()] },
			attachTo: document.body,
		});
		await wrapper.find('.cut-line').trigger('click');
		await flushPromises();

		const card = wrapper.find('[data-index="2"]');
		card.element.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
		);
		await wrapper.vm.$nextTick();

		expect(card.classes()).toContain('clicked');
		wrapper.unmount();
	});

	it('reveals the next card on a left swipe and peeks on a right swipe', async () => {
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
		await flushPromises();

		const dispatchTouch = (
			type: string,
			prop: string,
			x: number,
			y: number,
		) => {
			const event = new Event(type) as Event & Record<string, unknown>;
			Object.defineProperty(event, prop, {
				value: [{ clientX: x, clientY: y }],
			});
			window.dispatchEvent(event);
		};

		// Swipe left: reveal the next card
		dispatchTouch('touchstart', 'touches', 200, 100);
		dispatchTouch('touchend', 'changedTouches', 100, 100);
		await wrapper.vm.$nextTick();
		expect(wrapper.findAll('.card.clicked').length).toBe(1);

		// Swipe right: peek, then auto-release
		vi.useFakeTimers();
		dispatchTouch('touchstart', 'touches', 100, 100);
		dispatchTouch('touchend', 'changedTouches', 200, 100);
		await wrapper.vm.$nextTick();
		expect(wrapper.find('.cards-container').classes()).toContain('preview');

		vi.advanceTimersByTime(400);
		await wrapper.vm.$nextTick();
		expect(wrapper.find('.cards-container').classes()).not.toContain('preview');
		vi.useRealTimers();
	});

	it('previews the next card while ArrowLeft is held and stops when it is released', async () => {
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
		await flushPromises();

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
		await wrapper.vm.$nextTick();
		expect(wrapper.find('.cards-container').classes()).toContain('preview');

		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
		await wrapper.vm.$nextTick();
		expect(wrapper.find('.cards-container').classes()).not.toContain('preview');
	});

	it('ignores touch gestures that are too short or more vertical than horizontal', async () => {
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
		await flushPromises();

		const dispatchTouch = (
			type: string,
			prop: string,
			x: number,
			y: number,
		) => {
			const event = new Event(type) as Event & Record<string, unknown>;
			Object.defineProperty(event, prop, {
				value: [{ clientX: x, clientY: y }],
			});
			window.dispatchEvent(event);
		};

		// Horizontal movement under the swipe threshold
		dispatchTouch('touchstart', 'touches', 100, 100);
		dispatchTouch('touchend', 'changedTouches', 110, 100);
		await wrapper.vm.$nextTick();
		expect(wrapper.findAll('.card.clicked').length).toBe(0);

		// Mostly vertical movement (a scroll, not a swipe)
		dispatchTouch('touchstart', 'touches', 100, 100);
		dispatchTouch('touchend', 'changedTouches', 60, 300);
		await wrapper.vm.$nextTick();
		expect(wrapper.findAll('.card.clicked').length).toBe(0);
		expect(wrapper.find('.cards-container').classes()).not.toContain('preview');
	});
});
