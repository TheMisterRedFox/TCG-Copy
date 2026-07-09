import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { cardGet, cardList } = vi.hoisted(() => ({
	cardGet: vi.fn(),
	cardList: vi.fn(),
}));

vi.mock('@tcgdex/sdk', () => ({
	default: class {
		card = { get: cardGet, list: cardList };
	},
	Query: class {
		equal() {
			return this;
		}
	},
}));

import { useTCGdexStore } from '@/stores/tcgdexStore';

describe('tcgdexStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		cardGet.mockReset();
		cardList.mockReset();
	});

	afterEach(() => {
		localStorage.clear();
	});

	describe('getCard', () => {
		it('fetches and caches a card on a cold cache', async () => {
			const store = useTCGdexStore();
			cardGet.mockResolvedValue({ id: 'base1-4', name: 'Charmander' });

			const card = await store.getCard('base1-4');

			expect(card).toEqual({ id: 'base1-4', name: 'Charmander' });
			expect(cardGet).toHaveBeenCalledWith('base1-4');
			expect(store.loading).toBe(false);
			expect(store.error).toBeNull();
		});

		it('returns the in-memory cached card without calling the SDK again', async () => {
			const store = useTCGdexStore();
			cardGet.mockResolvedValue({ id: 'base1-4', name: 'Charmander' });

			await store.getCard('base1-4');
			await store.getCard('base1-4');

			expect(cardGet).toHaveBeenCalledTimes(1);
		});

		it('reads from the persistent cache when the in-memory cache is cold', async () => {
			const store = useTCGdexStore();
			cardGet.mockResolvedValue({ id: 'base1-4', name: 'Charmander' });
			await store.getCard('base1-4');

			// Simulate a fresh page load: new store, in-memory cache is empty,
			// but the previous run's data was persisted to localStorage.
			const freshStore = useTCGdexStore(createPinia());
			cardGet.mockClear();

			const card = await freshStore.getCard('base1-4');

			expect(card).toEqual({ id: 'base1-4', name: 'Charmander' });
			expect(cardGet).not.toHaveBeenCalled();
		});

		it('sets an error and returns null when the SDK call fails', async () => {
			const store = useTCGdexStore();
			cardGet.mockRejectedValue(new Error('network down'));

			const card = await store.getCard('base1-4');

			expect(card).toBeNull();
			expect(store.error).toContain('network down');
			expect(store.loading).toBe(false);
		});
	});

	describe('getBaseSetCardId', () => {
		it('returns null and caches it when no printings exist for the name', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([]);

			const id = await store.getBaseSetCardId('Missingno');

			expect(id).toBeNull();
			expect(store.baseSetMap.Missingno).toBeNull();
		});

		it('returns null when no printing is from the base set', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([{ id: 'swsh1-4', name: 'Charmander' }]);

			const id = await store.getBaseSetCardId('Charmander');

			expect(id).toBeNull();
		});

		it('returns the base-set printing id when one is found', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([
				{ id: 'swsh1-4', name: 'Charmander' },
				{ id: 'base1-4', name: 'Charmander' },
			]);

			const id = await store.getBaseSetCardId('Charmander');

			expect(id).toBe('base1-4');
		});

		it('does not call the SDK again once a name is cached in memory', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([{ id: 'base1-4', name: 'Charmander' }]);

			await store.getBaseSetCardId('Charmander');
			await store.getBaseSetCardId('Charmander');

			expect(cardList).toHaveBeenCalledTimes(1);
		});

		it('reads a cached "no base set" result from the persistent cache', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([]);
			await store.getBaseSetCardId('Missingno');

			const freshStore = useTCGdexStore(createPinia());
			cardList.mockClear();

			const id = await freshStore.getBaseSetCardId('Missingno');

			expect(id).toBeNull();
			expect(cardList).not.toHaveBeenCalled();
		});

		it('sets an error and returns null when the SDK call fails', async () => {
			const store = useTCGdexStore();
			cardList.mockRejectedValue(new Error('rate limited'));

			const id = await store.getBaseSetCardId('Charmander');

			expect(id).toBeNull();
			expect(store.error).toContain('rate limited');
		});
	});

	describe('getBaseSetCard', () => {
		it('composes getBaseSetCardId and getCard', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([{ id: 'base1-4', name: 'Charmander' }]);
			cardGet.mockResolvedValue({ id: 'base1-4', attacks: [] });

			const card = await store.getBaseSetCard('Charmander');

			expect(cardList).toHaveBeenCalled();
			expect(cardGet).toHaveBeenCalledWith('base1-4');
			expect(card).toEqual({ id: 'base1-4', attacks: [] });
		});

		it('skips fetching the card when no base-set id is found', async () => {
			const store = useTCGdexStore();
			cardList.mockResolvedValue([]);

			const card = await store.getBaseSetCard('Missingno');

			expect(card).toBeNull();
			expect(cardGet).not.toHaveBeenCalled();
		});
	});
});
