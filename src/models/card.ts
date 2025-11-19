export class Card {
	id: number;
	name: string;
	rarity: string;

	constructor(id: number, name: string, rarity: string) {
		this.id = id;
		this.name = name;
		this.rarity = rarity;
	}

	getId(): number {
		return this.id;
	}

	setId(id: number): void {
		this.id = id;
	}

	getName(): string {
		return this.name;
	}

	setName(name: string): void {
		this.name = name;
	}

	getRarity(): string {
		return this.rarity;
	}

	setRarity(rarity: string): void {
		this.rarity = rarity;
	}
}
