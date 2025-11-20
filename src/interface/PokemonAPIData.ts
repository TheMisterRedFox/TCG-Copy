import type { Abilities, Types } from './GeneralTypes';

export interface PokemonAPIData {
	name: string;
	custom_image?: string;
	types: Types[];
	weight: number;
	height: number;
	abilities: Abilities[];
}
