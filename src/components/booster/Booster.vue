<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import ShrekImage from '@/assets/img/sticker-shrek.jpg';
import pokemonList from '@/assets/pokemon.json';
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import type { Attack, Move } from '@/interfaces/GeneralTypes';
import type { GeneratedCard } from '@/interfaces/GeneratedCard';
import type { PokemonAPIData } from '@/interfaces/PokemonAPIData';
import type { PokemonJSON } from '@/interfaces/PokemonJSON';
import { Card as CardModel } from '@/models/card';

// ---------------------------------------------------------------
// Data
// ---------------------------------------------------------------
const BOOSTER_LENGTH = 5;
const typedPokemonList: PokemonJSON[] = pokemonList;
const pokemonCards = typedPokemonList.map(
	(pokemon) => new CardModel(pokemon.id, pokemon.name, pokemon.rarity),
);
// Liste des cartes générées
const generatedCards = ref<GeneratedCard[]>([]);

// Indices des cartes "cliquées" ou "skippées"
const clickedIndices = ref<number[]>([]);

// Index de la carte actuellement sélectionnée
const selectedIndex = ref(0);

const cutted = ref(false);

const isPreviewing = ref(false);

const allCardsClicked = ref(false);

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
	if (roll < 72.5) rarity = 0;
	else if (roll < 92.5) rarity = 1;
	else if (roll < 97.5) rarity = 2;
	else if (roll < 99.6) rarity = 3;
	else if (roll < 99.9) rarity = 4;
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
			stats: [{ base_stat: 180, stat: { name: 'hp' } }],
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
	const empty = Array.from({ length: BOOSTER_LENGTH }, () => ({
		loading: true,
		card: null,
		data: null,
	}));
	generatedCards.value = empty;
	for (let i = 0; i < BOOSTER_LENGTH; i++) {
		const card = pickRandomCard();
		const data = await fetchPokemonData(card.id);
		generatedCards.value[i] = {
			loading: false,
			card,
			data,
		};
	}

	generatedCards.value = generatedCards.value.sort(
		(a, b) => (a.card?.rarity ?? 0) - (b.card?.rarity ?? 0),
	);
};

const cutBooster = (): void => {
	cutted.value = true;
	generateBooster();
};

const redoBooster = (): void => {
	cutted.value = false;
	clickedIndices.value = [];
	selectedIndex.value = 0;
	allCardsClicked.value = false;
};

// ---------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'ArrowRight' && cutted.value === true) {
		if (selectedIndex.value < generatedCards.value.length) {
			selectedIndex.value++;
			if (!clickedIndices.value.includes(selectedIndex.value - 1)) {
				clickedIndices.value.push(selectedIndex.value - 1);
			}

			if (selectedIndex.value === generatedCards.value.length) {
				allCardsClicked.value = true;
			}
		}
	}
	if (
		event.key === 'ArrowLeft' &&
		cutted.value === true &&
		selectedIndex.value < 4
	) {
		isPreviewing.value = true; // Activer le mode "preview"
	}
};

const handleKeyup = (event: KeyboardEvent) => {
	if (event.key === 'ArrowLeft') {
		isPreviewing.value = false; // Désactiver le mode "preview"
	}
};

const onCardClicked = (index: number): void => {
	if (!clickedIndices.value.includes(index)) {
		clickedIndices.value.push(index);
	}

	if (index === BOOSTER_LENGTH - 1) {
		allCardsClicked.value = true;
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
	window.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown);
	window.removeEventListener('keyup', handleKeyup);
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

		<div class="cards-container" :class="{ preview: isPreviewing, allCardsClicked: allCardsClicked}">
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
			<Button v-if="allCardsClicked" @click="redoBooster" class="booster-button">
				<img src="../../assets/img/booster-icon.png" alt="booster-icon">
			</Button>
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
