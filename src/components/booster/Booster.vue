<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ShrekImage from '@/assets/img/sticker-shrek.jpg';
import pokemonList from '@/assets/pokemon.json';
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import type { Attack, Move } from '@/interface/GeneralTypes';
import type { GeneratedCard } from '@/interface/GeneratedCard';
import type { PokemonAPIData } from '@/interface/PokemonAPIData';
import type { PokemonJSON } from '@/interface/PokemonJSON';
import { Card as CardModel } from '@/models/card';

// ---------------------------------------------------------------
// Data
// ---------------------------------------------------------------
const typedPokemonList: PokemonJSON[] = pokemonList;
const pokemonCards = typedPokemonList.map(
	(pokemon) => new CardModel(pokemon.id, pokemon.name, pokemon.rarity),
);
// Liste des cartes générées
const generatedCards = ref<GeneratedCard[]>([]);

// Indices des cartes "cliquées" ou "skippées"
const clickedIndices = ref<number[]>([]);

// Index de la carte actuellement sélectionnée
const selectedIndex = ref(-1);

const cutted = ref(false);

// ---------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------
const getRandomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const getRarityName = (rarity: number): string => {
	switch (rarity) {
		case 0:
			return 'Common';
		case 1:
			return 'Uncommon';
		case 2:
			return 'Rare';
		case 3:
			return 'Very Rare';
		case 4:
			return 'Legendary';
		default:
			return 'Shrek';
	}
};

const pickRandomCard = (): CardModel => {
	const roll = Math.random() * 100;
	let rarity: number;
	if (roll < 50) rarity = 4;
	else rarity = 5;
	const list = pokemonCards.filter((card) => card.rarity === rarity);
	return list[getRandomInt(0, list.length - 1)]!;
};

// ---------------------------------------------------------------
// API fetch (PokéAPI or custom for Shrek)
// ---------------------------------------------------------------
const fetchPokemonData = async (id: number): Promise<PokemonAPIData> => {
	if (id === 0) {
		return {
			name: 'Shrek',
			custom_image: ShrekImage,
			types: [{ type: { name: 'ground' } }],
			weight: 1500,
			height: 20,
			abilities: [{ ability: { name: 'swamp-smash' } }],
			moves: [{ move: { name: 'onion-throw', url: '' } }],
			attacks: [
				{
					name: 'Onion Throw',
					type: 'ground',
					power: 50,
					energy: ['colorless', 'colorless'],
				},
			],
		};
	}
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
	if (!res.ok) throw new Error('API error');
	const data = await res.json();

	// Pick first 2 moves for attacks
	const moves = data.moves.slice(0, 2);

	const attacks: Attack[] = await Promise.all(
		moves.map(async (move: Move) => {
			const moveRes = await fetch(move.move.url);
			const moveData = await moveRes.json();
			return {
				name: moveData.name,
				type: moveData.type.name,
				power: moveData.power,
				energy: Array.from(
					{ length: Math.max(Math.ceil((moveData.power ?? 10) / 30), 1) },
					() => '⚡',
				),
			};
		}),
	);

	return { ...data, attacks };
};

// ---------------------------------------------------------------
// Booster generation
// ---------------------------------------------------------------
const generateBooster = async (): Promise<void> => {
	generatedCards.value = []; // clear old cards
	const empty = Array.from({ length: 5 }, () => ({
		loading: true,
		card: null,
		data: null,
	}));
	generatedCards.value = empty;
	for (let i = 0; i < 5; i++) {
		const card = pickRandomCard();
		const data = await fetchPokemonData(card.id);
		generatedCards.value[i] = {
			loading: false,
			card,
			data,
		};
	}
};

const cutBooster = (): void => {
	cutted.value = true;
	generateBooster();
};

const redoBooster = (): void => {
	cutted.value = false;
	clickedIndices.value = [];
	selectedIndex.value = 0;
	generateBooster();
};

// ---------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'ArrowRight') {
		if (selectedIndex.value < generatedCards.value.length) {
			selectedIndex.value++;
			if (!clickedIndices.value.includes(selectedIndex.value - 1)) {
				clickedIndices.value.push(selectedIndex.value - 1);
			}
		}
	}
};

const onCardClicked = (index: number): void => {
	if (!clickedIndices.value.includes(index)) {
		clickedIndices.value.push(index);
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
	<div class="opening-container">
		<div class="booster-container shrek" :class="{ cutted }">
			<div class="cut-container">
				<div class="top-border"></div>
				<div class="cut-line" @click="cutBooster"></div>
			</div>
			<div class="uncutting-container">
				<div class="center-body">
					<div class="cover"></div>
					<div class="shadow"></div>
				</div>
				<div class="bottom-border"></div>
			</div>
		</div>

		<div class="cards-container">
			<Card
				v-for="(item, index) in generatedCards"
				:key="index"
				:index="index"
				:item="item"
				:clickedIndices="clickedIndices"
				:selectedIndex="selectedIndex"
				@select="selectedIndex = $event"
				@clickCard="onCardClicked"
			/>
		</div>

		<div class="controls">
			<Button @click="redoBooster">Redo Booster</Button>
		</div>
	</div>
</template>

<style scoped>
/* Reuse your existing CSS */
@import './Booster.less';
@import '../card/Card.less';

.controls {
	margin-top: 15px;
	display: flex;
	justify-content: center;
}
</style>
