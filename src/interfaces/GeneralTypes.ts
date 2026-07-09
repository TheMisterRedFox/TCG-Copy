import type { Card as TCGdexCard } from '@tcgdex/sdk';

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

/** A single attack as returned by the TCGdex API for a card. */
export type Attack = NonNullable<TCGdexCard['attacks']>[number];

/** A single weakness as returned by the TCGdex API for a card. */
export type Weakness = NonNullable<TCGdexCard['weaknesses']>[number];

/** The full TCGdex card shape, re-exported so call sites don't import the SDK directly. */
export type Card = TCGdexCard;
