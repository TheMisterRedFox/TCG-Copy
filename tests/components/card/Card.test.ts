import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Card from '@/components/card/Card.vue';
import type { Card as BaseSetCard } from '@/interfaces/GeneralTypes';
import type { GeneratedCard } from '@/interfaces/GeneratedCard';
import { useTCGdexStore } from '@/stores/tcgdexStore';

const baseItem: GeneratedCard = {
	loading: false,
	card: { id: 4, name: 'Charmander', rarity: 1 },
	data: {
		name: 'Charmander',
		types: [{ type: { name: 'fire' } }],
		weight: 85,
		height: 6,
		abilities: [],
		moves: [],
		stats: [{ base_stat: 39, stat: { name: 'hp' } }],
	},
};

const mountCard = (
	props: Partial<{
		index: number;
		item: GeneratedCard;
		clickedIndices: number[];
		selectedIndex: number;
	}> = {},
	baseSetCard: BaseSetCard | null = null,
) => {
	const pinia = createPinia();
	const tcgStore = useTCGdexStore(pinia);
	vi.spyOn(tcgStore, 'getBaseSetCard').mockResolvedValue(baseSetCard);

	const wrapper = mount(Card, {
		global: { plugins: [pinia] },
		props: {
			index: 0,
			item: baseItem,
			clickedIndices: [],
			selectedIndex: 0,
			...props,
		},
	});
	return { wrapper, tcgStore };
};

describe('Card.vue', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('shows a loading skeleton and does not render card content while loading', async () => {
		const { wrapper, tcgStore } = mountCard({
			item: { loading: true, card: null, data: null },
		});
		await flushPromises();

		expect(wrapper.classes()).toContain('loading');
		expect(wrapper.attributes('aria-busy')).toBe('true');
		expect(wrapper.attributes('aria-label')).toBe('Card 1, loading');
		expect(wrapper.find('.card-header').exists()).toBe(false);
		expect(wrapper.find('.card-body').exists()).toBe(false);
		expect(tcgStore.getBaseSetCard).not.toHaveBeenCalled();
	});

	it('marks the card unavailable when generation failed for that slot', async () => {
		const { wrapper, tcgStore } = mountCard({
			item: { loading: false, card: null, data: null },
		});
		await flushPromises();

		expect(wrapper.attributes('aria-busy')).toBe('false');
		expect(wrapper.attributes('aria-label')).toBe('Card 1, unavailable');
		expect(wrapper.find('.card-header').exists()).toBe(false);
		expect(tcgStore.getBaseSetCard).not.toHaveBeenCalled();
	});

	it('renders full card content once loaded and fetches its base-set attacks/weaknesses', async () => {
		const { wrapper, tcgStore } = mountCard(
			{ index: 2 },
			{
				id: 'base1-4',
				image: '',
				localId: '4',
				name: 'Charmander',
				rarity: 'Common',
				hp: 39,
				types: ['Fire'],
				evolveFrom: '',
				description: '',
				stage: '',
				attacks: [{ name: 'Scratch', cost: [], damage: 10, effect: null }],
				weaknesses: [{ type: 'water', value: '+20' }],
				retreat: 1,
			},
		);
		await flushPromises();

		expect(tcgStore.getBaseSetCard).toHaveBeenCalledWith('Charmander');
		expect(wrapper.find('.card-header').exists()).toBe(true);
		expect(wrapper.find('.card-illustration').exists()).toBe(true);
		expect(wrapper.find('.attack').text()).toContain('Scratch');
		expect(wrapper.classes()).toContain('rarity-1');
		expect(wrapper.classes()).toContain('type-fire');
		expect(wrapper.classes()).toContain('card-4');
		expect(wrapper.classes()).toContain('index-2');
	});

	it('marks the card clicked and describes it as revealed once its index is in clickedIndices', async () => {
		const { wrapper } = mountCard({ clickedIndices: [0] });
		await flushPromises();

		expect(wrapper.classes()).toContain('clicked');
		expect(wrapper.attributes('aria-label')).toBe('Charmander, revealed');
	});

	it('describes an unclicked, loaded card as not yet revealed', async () => {
		const { wrapper } = mountCard({ clickedIndices: [] });
		await flushPromises();

		expect(wrapper.classes()).not.toContain('clicked');
		expect(wrapper.attributes('aria-label')).toBe('Card 1, not yet revealed');
	});

	it('emits select and clickCard with its index when clicked', async () => {
		const { wrapper } = mountCard({ index: 3 });
		await flushPromises();

		await wrapper.trigger('click');

		expect(wrapper.emitted('select')).toEqual([[3]]);
		expect(wrapper.emitted('clickCard')).toEqual([[3]]);
	});
});
