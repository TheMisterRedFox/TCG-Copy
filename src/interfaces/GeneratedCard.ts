import type { Card } from './Card.ts';
import type { PokemonAPIData } from './PokemonAPIData.ts';

export interface GeneratedCard {
	loading: boolean;
	card: Card | null;
	data: PokemonAPIData | null;
	clicked?: boolean;
}
