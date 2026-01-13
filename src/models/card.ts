import type { Card as CardType } from '@/interfaces/Card.ts';

export class Card implements CardType {
	constructor(
		public readonly id: number,
		public name: string,
		public rarity: number,
	) {}
}
