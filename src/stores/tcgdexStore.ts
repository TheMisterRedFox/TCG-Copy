import TCGdex, {
	type CardResumeModel,
	Query,
	type Card as TCGdexCard,
} from '@tcgdex/sdk';
import { defineStore } from 'pinia';
import { getCached, setCached } from '@/utils/persistentCache';

const tcgdex = new TCGdex('en');
const CARD_NAMESPACE = 'tcgdex-card';
const BASE_SET_NAMESPACE = 'tcgdex-base-set-id';

export const useTCGdexStore = defineStore('tcgdex', {
	state: () => ({
		cards: {} as Record<string, TCGdexCard>, // cache full cards
		baseSetMap: {} as Record<string, string | null>, // cache cardId for base set
		loading: false,
		error: null as string | null,
	}),

	actions: {
		async getCard(id: string): Promise<TCGdexCard | null> {
			if (this.cards[id]) return this.cards[id];

			const cached = getCached<TCGdexCard>(CARD_NAMESPACE, id);
			if (cached) {
				this.cards[id] = cached;
				return cached;
			}

			this.loading = true;
			this.error = null;

			try {
				const card = await tcgdex.card.get(id);
				if (!card) return null;

				this.cards[id] = card;
				setCached(CARD_NAMESPACE, id, card);
				return card;
			} catch (e) {
				this.error = String(e);
				return null;
			} finally {
				this.loading = false;
			}
		},

		async getBaseSetCardId(name: string): Promise<string | null> {
			// Use in-memory cache if available
			if (this.baseSetMap[name] !== undefined) {
				return this.baseSetMap[name];
			}

			// Fall back to the persistent cache (survives page reloads)
			const cached = getCached<string | null>(BASE_SET_NAMESPACE, name);
			if (cached !== undefined) {
				this.baseSetMap[name] = cached;
				return cached;
			}

			this.loading = true;
			this.error = null;

			try {
				// Step 1: get all printings for this Pokémon
				const cards = await tcgdex.card.list(new Query().equal('name', name));

				if (!cards.length) {
					this.baseSetMap[name] = null;
					setCached(BASE_SET_NAMESPACE, name, null);
					return null;
				}

				// Step 2: find Base Set version
				const baseSetCard = cards.find((card: CardResumeModel) =>
					card.id.includes('base'),
				);

				if (!baseSetCard) {
					this.baseSetMap[name] = null;
					setCached(BASE_SET_NAMESPACE, name, null);
					return null;
				}

				this.baseSetMap[name] = baseSetCard.id;
				setCached(BASE_SET_NAMESPACE, name, baseSetCard.id);
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
