import type { Card as CardType } from '@/interface/Card.ts';

export class Card implements CardType {
	constructor(
		public readonly id: number,
		public name: string,
		public rarity: number,
	) {}
}
