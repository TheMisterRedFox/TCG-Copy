<script setup lang="ts">
import { ref } from 'vue';
import ShrekImage from '@/assets/img/sticker-shrek.jpg';
import pokemonList from '@/assets/pokemon.json';
import Button from '@/components/button/Button.vue';
import type { Abilities, Types } from '@/interface/GeneralTypes';
import type { GeneratedCard } from '@/interface/GeneratedCard';
import type { PokemonAPIData } from '@/interface/PokemonAPIData';
import type { PokemonJSON } from '@/interface/PokemonJSON';
import { Card } from '@/models/card';

// ---------------------------------------------------------------
// Data
// ---------------------------------------------------------------

const typedPokemonList: PokemonJSON[] = pokemonList;
const pokemonCards = typedPokemonList.map(
	(pokemon) => new Card(pokemon.id, pokemon.name, pokemon.rarity),
);

const generatedCards = ref<GeneratedCard[]>([]);
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

const pickRandomCard = (): Card => {
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
		};
	}

	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
	if (!res.ok) throw new Error('API error');
	return res.json();
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
	generateBooster();
};
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
			<div
				v-for="(item, index) in generatedCards"
				:key="index"
				class="card"
				:class="[
					item.clicked ? 'clicked' : '',
					item.card ? `rarity-${item.card?.rarity}` : '',
					item.card ? `type-${item.data?.types[0]?.type.name}` : '',
				]"
				@click="item.clicked = true"
			>
				<!-- Header -->
				<div class="card-inner">
					<div class="card-header">
						<p class="card-name">
							{{ item.card?.name || 'Loading…' }}
						</p>
					</div>

					<!-- Illustration -->
					<div class="card-illustration">
						<div v-if="item.loading">Loading…</div>

						<img v-else-if="item.data?.custom_image" :src="item.data?.custom_image" :alt="item.data?.name" />

						<img
							v-else
							:src="`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(item.card?.id).padStart(
								3,
								'0'
							)}.png`"
							:alt="item.data?.name"
						/>
					</div>

					<!-- Body -->
					<div class="card-body" v-if="!item.loading && item.data">
						<p>Rarity : {{ getRarityName(item.card?.rarity ?? 0) }}</p>
						<p>Type : {{ item.data.types.map((type: Types) => type.type.name).join(', ') }}</p>
						<p>Weight : {{ item.data.weight / 10 }} kg</p>
						<p>Height : {{ item.data.height / 10 }} m</p>
						<p>Abilities : {{ item.data.abilities.map((ability: Abilities) => ability.ability.name).join(', ') }}</p>
					</div>
				</div>
				<div class="card-rarity">
					<span v-if="item.card && item.card?.rarity < 4">
						<span v-for="n in item.card?.rarity + 1" :key="n">🔶</span>
					</span>
					<span v-else-if="item.card?.rarity === 4"> 🌟 Legendary </span>
					<span v-else-if="item.card?.rarity === 5"> 🤢 Shrek </span>
				</div>
			</div>
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
