export interface Type {
	type: { name: string };
}

export interface Ability {
	ability: { name: string };
}

export interface Move {
	move: {
		name: string;
		url: string;
	};
}

export interface Attack {
	name: string;
	type: string;
	power: number | null;
	energy: string[];
}

export interface Stat {
	base_stat: number;
	stat: { name: string };
}

/**
 * ------------------------------------
 * V2
 * ------------------------------------
 */

export interface CardV2 {
	id: string;
	image: string;
	localId: string;
	name: string;
	rarity: string;
	hp: number;
	types: string[];
	evolveFrom: string;
	description: string;
	stage: string;
	attacks: AttackV2[];
	weaknesses: WeaknessV2[];
	retreat: number;
}

export interface AttackV2 {
	cost: string[];
	damage: number | null;
	effect: string;
	name: string;
}

export interface WeaknessV2 {
	type: string;
	value: string;
}
