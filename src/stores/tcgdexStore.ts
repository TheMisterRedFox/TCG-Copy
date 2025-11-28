import TCGdex, { type CardResumeModel, Query } from '@tcgdex/sdk';
import { defineStore } from 'pinia';

const tcgdex = new TCGdex('en');

export const useTCGdexStore = defineStore('tcgdex', {
	state: () => ({
		cards: {} as Record<string, any>, // cache full cards
		baseSetMap: {} as Record<string, string | null>, // cache cardId for base set
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async getCard(id: string) {
			if (this.cards[id]) return this.cards[id];

			this.loading = true;
			this.error = null;

			try {
				const card = await tcgdex.card.get(id);
				this.cards[id] = card;
				return card;
			} catch (e) {
				this.error = String(e);
				return null;
			} finally {
				this.loading = false;
			}
		},

		async getBaseSetCardId(name: string): Promise<string | null> {
			// Use cache if available
			if (this.baseSetMap[name] !== undefined) {
				return this.baseSetMap[name];
			}

			this.loading = true;
			this.error = null;

			try {
				// Step 1: get all printings for this Pokémon
				const cards = await tcgdex.card.list(new Query().equal('name', name));

				if (!cards.length) {
					this.baseSetMap[name] = null;
					return null;
				}

				// Step 2: find Base Set version
				const baseSetCard = cards.find((card: CardResumeModel) =>
					card.id.includes('base'),
				);

				if (!baseSetCard) {
					this.baseSetMap[name] = null;
					return null;
				}

				this.baseSetMap[name] = baseSetCard.id;
				return baseSetCard.id;
			} catch (e) {
				this.error = String(e);
				return null;
			} finally {
				this.loading = false;
			}
		},

		async getBaseSetCard(name: string) {
			// Step 1 → get the base set ID for that Pokémon
			const id = await this.getBaseSetCardId(name);
			if (!id) return null;

			// Step 2 → fetch complete card detail
			return await this.getCard(id);
		},
	},
});
