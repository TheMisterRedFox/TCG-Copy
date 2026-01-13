import type { Ability, Attack, Move, Stat, Type } from './GeneralTypes';

export interface PokemonAPIData {
	name: string;
	custom_image?: string;
	types: Type[];
	weight: number;
	height: number;
	abilities: Ability[];
	moves: Move[];
	attacks?: Attack[];
	stats: Stat[];
}
