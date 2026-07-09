import type { Ability, Move, Stat, Type } from './GeneralTypes';

/**
 * A synthetic "attack" derived from a PokeAPI move for flavor. Distinct from
 * the real TCG `Attack` (see GeneralTypes.ts), which comes from TCGdex and
 * has a different shape (cost/damage/effect vs type/power/energy here).
 */
export interface PokemonMoveAttack {
	name: string;
	type: string;
	power: number | null;
	energy: string[];
}

export interface PokemonAPIData {
	name: string;
	custom_image?: string;
	types: Type[];
	weight: number;
	height: number;
	abilities: Ability[];
	moves: Move[];
	attacks?: PokemonMoveAttack[];
	stats: Stat[];
}
