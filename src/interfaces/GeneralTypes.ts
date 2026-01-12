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

export interface Stat {
	base_stat: number;
	stat: { name: string };
}

export interface Attack {
	cost: string[];
	damage: number | null;
	effect: string | null;
	name: string;
}

export interface Weakness {
	type: string;
	value: string;
}

export interface Card {
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
	attacks: Attack[];
	weaknesses: Weakness[];
	retreat: number;
}
