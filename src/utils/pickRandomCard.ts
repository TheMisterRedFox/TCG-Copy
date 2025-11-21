import pokemonCards from '@/assets/pokemon.json';
import { DROP_THRESHOLDS } from '@/constants/dropRates';
import type { Card } from '@/interface/Card';
import { getRandomInt } from '@/utils/getRandomInt';

export const pickRandomCard = (): Card => {
	const roll = Math.random() * 100;

	// Trouve la rareté en fonction des seuils cumulés
	const rarity = DROP_THRESHOLDS.findIndex((t) => roll < t);

	const list = pokemonCards.filter((card) => card.rarity === rarity);
	return list[getRandomInt(0, list.length - 1)]!;
};
