<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ShrekImage from '@/assets/img/sticker-shrek.jpg';
import pokemonList from '@/assets/pokemon.json';
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import type { Attack, Move } from '@/interfaces/GeneralTypes';
import type { GeneratedCard } from '@/interfaces/GeneratedCard';
import type { PokemonAPIData } from '@/interfaces/PokemonAPIData';
import type { PokemonJSON } from '@/interfaces/PokemonJSON';
import { Card as CardModel } from '@/models/card';
import { useTCGdexStore } from '@/stores/tcgdexStore';
import { getCached, setCached } from '@/utils/persistentCache';

// ---------------------------------------------------------------
// Data
// ---------------------------------------------------------------
const BOOSTER_LENGTH = 5;

const typedPokemonList: PokemonJSON[] = pokemonList;

const pokemonCards = typedPokemonList.map(
	(pokemon) => new CardModel(pokemon.id, pokemon.name, pokemon.rarity),
);

const cardsByRarity = new Map<number, CardModel[]>();
for (const card of pokemonCards) {
	const list = cardsByRarity.get(card.rarity);
	if (list) list.push(card);
	else cardsByRarity.set(card.rarity, [card]);
}

const tcgStore = useTCGdexStore();

// Cards generated in the booster
const generatedCards = ref<GeneratedCard[]>([]);

// Set when a booster fails to generate (e.g. PokeAPI unreachable)
const generationError = ref<string | null>(null);
const errorMessage = computed(() => generationError.value || tcgStore.error);

// Navigation and state tracking
const clickedIndices = ref<number[]>([]);
const selectedIndex = ref(0);
const cutted = ref(false);
const isPreviewing = ref(false);
const allCardsClicked = ref(false);

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const getRandomInt = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandomCard = (): CardModel => {
	const roll = Math.random() * 100;
	let rarity: number;

	if (roll < 72.5) rarity = 0;
	else if (roll < 92.5) rarity = 1;
	else if (roll < 97.5) rarity = 2;
	else if (roll < 99.6) rarity = 3;
	else if (roll < 99.9) rarity = 4;
	else rarity = 5;

	// Rolled rarity tier may be empty; widen the search outward until one is found
	for (let offset = 0; offset <= 5; offset++) {
		const list =
			cardsByRarity.get(rarity - offset) ?? cardsByRarity.get(rarity + offset);
		if (list?.length) return list[getRandomInt(0, list.length - 1)]!;
	}

	throw new Error('No Pokemon cards available to generate a booster.');
};

// ---------------------------------------------------------------
// API Fetch
// ---------------------------------------------------------------
const POKEMON_CACHE_NAMESPACE = 'pokeapi-pokemon';
const MOVE_CACHE_NAMESPACE = 'pokeapi-move';

// Many Pokemon share moves (e.g. "tackle"); avoid re-fetching the same move URL
// biome-ignore lint/suspicious/noExplicitAny: mirrors the untyped PokeAPI response shape used below
const moveCache = new Map<string, any>();

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
					cost: ['ground'],
					damage: 50,
					effect: 'May cause the opponent to cry',
				},
			],
			stats: [{ base_stat: 180, stat: { name: 'hp' } }],
		};
	}

	const cachedPokemon = getCached<PokemonAPIData>(
		POKEMON_CACHE_NAMESPACE,
		String(id),
	);
	if (cachedPokemon) return cachedPokemon;

	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
	if (!res.ok) throw new Error('API error');
	const data = await res.json();

	// Pick first 2 moves for attacks
	const moves = data.moves.slice(0, 2);

	const attacks: Attack[] = await Promise.all(
		moves.map(async (move: Move) => {
			const memoized = moveCache.get(move.move.url);
			if (memoized) return memoized;

			const cached = getCached(MOVE_CACHE_NAMESPACE, move.move.url);
			if (cached) {
				moveCache.set(move.move.url, cached);
				return cached;
			}

			const moveRes = await fetch(move.move.url);
			const moveData = await moveRes.json();

			const attack = {
				name: moveData.name,
				type: moveData.type.name,
				power: moveData.power,
				energy: Array.from(
					{ length: Math.max(Math.ceil((moveData.power ?? 10) / 30), 1) },
					() => '⚡',
				),
			};

			moveCache.set(move.move.url, attack);
			setCached(MOVE_CACHE_NAMESPACE, move.move.url, attack);
			return attack;
		}),
	);

	const result = { ...data, attacks };
	setCached(POKEMON_CACHE_NAMESPACE, String(id), result);
	return result;
};

// ---------------------------------------------------------------
// Booster generation
// ---------------------------------------------------------------
const generateBooster = async (): Promise<void> => {
	generationError.value = null;

	// Pick all 5 cards up front and fix their display order (by rarity), then
	// fetch each one's data concurrently; each slot flips from loading to
	// loaded independently as its own fetch resolves.
	const cards = Array.from({ length: BOOSTER_LENGTH }, () =>
		pickRandomCard(),
	).sort((a, b) => a.rarity - b.rarity);

	generatedCards.value = cards.map((card) => ({
		loading: true,
		card,
		data: null,
	}));

	await Promise.allSettled(
		cards.map(async (card, i) => {
			try {
				const data = await fetchPokemonData(card.id);
				generatedCards.value[i] = { loading: false, card, data };
			} catch (e) {
				generationError.value = 'Failed to generate booster. Please try again.';
				console.error(e);
				generatedCards.value[i] = { loading: false, card: null, data: null };
			}
		}),
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
// Shared reveal/peek logic, driven by keyboard, touch, and card clicks alike
// ---------------------------------------------------------------
const revealNextCard = (): void => {
	if (cutted.value !== true) return;

	if (selectedIndex.value < generatedCards.value.length) {
		selectedIndex.value++;
		if (!clickedIndices.value.includes(selectedIndex.value - 1)) {
			clickedIndices.value.push(selectedIndex.value - 1);
		}

		if (selectedIndex.value === generatedCards.value.length) {
			allCardsClicked.value = true;
		}
	}
};

const startPreview = (): void => {
	if (cutted.value === true && selectedIndex.value < 4) {
		isPreviewing.value = true;
	}
};

const endPreview = (): void => {
	isPreviewing.value = false;
};

const onCardClicked = (index: number): void => {
	if (!clickedIndices.value.includes(index)) {
		clickedIndices.value.push(index);
	}

	if (index === BOOSTER_LENGTH - 1) {
		allCardsClicked.value = true;
	}
};

// ---------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'ArrowRight') {
		revealNextCard();
	}
	if (event.key === 'ArrowLeft') {
		startPreview();
	}
	if ((event.key === 'Enter' || event.key === ' ') && cutted.value === true) {
		const target = event.target as HTMLElement;
		const cardEl = target.closest<HTMLElement>('.card[data-index]');
		if (cardEl) {
			event.preventDefault();
			const index = Number(cardEl.dataset.index);
			selectedIndex.value = index;
			onCardClicked(index);
		}
	}
};

const handleKeyup = (event: KeyboardEvent) => {
	if (event.key === 'ArrowLeft') {
		endPreview();
	}
};

// ---------------------------------------------------------------
// Touch navigation — swipe left advances/reveals, swipe right peeks
// (mirrors ArrowRight/ArrowLeft since a swipe is a one-shot gesture,
// not a hold, the peek auto-releases after a short delay)
// ---------------------------------------------------------------
const TOUCH_SWIPE_THRESHOLD = 40;
let touchStartX = 0;
let touchStartY = 0;
let previewReleaseTimeout: ReturnType<typeof setTimeout> | undefined;

const handleTouchStart = (event: TouchEvent) => {
	const touch = event.touches[0];
	if (!touch) return;
	touchStartX = touch.clientX;
	touchStartY = touch.clientY;
};

const handleTouchEnd = (event: TouchEvent) => {
	if (cutted.value !== true) return;

	const touch = event.changedTouches[0];
	if (!touch) return;

	const deltaX = touch.clientX - touchStartX;
	const deltaY = touch.clientY - touchStartY;

	if (
		Math.abs(deltaX) < TOUCH_SWIPE_THRESHOLD ||
		Math.abs(deltaX) < Math.abs(deltaY)
	) {
		return;
	}

	if (deltaX < 0) {
		revealNextCard();
	} else {
		clearTimeout(previewReleaseTimeout);
		startPreview();
		previewReleaseTimeout = setTimeout(endPreview, 400);
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
	window.addEventListener('keyup', handleKeyup);
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown);
	window.removeEventListener('keyup', handleKeyup);
	window.removeEventListener('touchstart', handleTouchStart);
	window.removeEventListener('touchend', handleTouchEnd);
	clearTimeout(previewReleaseTimeout);
});
</script>

<template>
	<div class="opening-container">
		<div class="booster-container shrek" :class="{ cutted }">
			<div class="cut-container">
				<div class="top-border"></div>
				<div
					class="cut-line"
					role="button"
					tabindex="0"
					aria-label="Cut open booster pack"
					@click="cutBooster"
					@keydown.enter="cutBooster"
					@keydown.space.prevent="cutBooster"
				></div>
			</div>
			<div class="uncutting-container">
				<div class="center-body">
					<div class="cover"></div>
					<div class="shadow"></div>
				</div>
				<div class="bottom-border"></div>
			</div>
		</div>

		<div
			class="cards-container"
			:class="{ preview: isPreviewing, allCardsClicked: allCardsClicked}"
			aria-live="polite"
		>
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

		<div v-if="errorMessage" class="generation-error" role="alert">
			<p>{{ errorMessage }}</p>
			<Button @click="generateBooster">Retry</Button>
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

.generation-error {
	margin-top: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	text-align: center;
	color: #b00020;
}
</style>
