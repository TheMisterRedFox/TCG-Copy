export class Card {
    constructor(id, name, rarity) {
        this.id = id;
        this.name = name;
        this.rarity = rarity;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getRarity() {
        return this.rarity;
    }

    setRarity(rarity) {
        this.rarity = rarity;
    }
}