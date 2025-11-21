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
