import { Card } from './entities/card.js';

// rareté 0 : Commun : 72.5%
// rareté 1 : Peu commun: 20%
// rareté 2 : Rare: 5%
// rareté 3 : Très rare : 2%
// rareté 4 : Légendaire : 0.4%
// rareté 5 : Shrek : 0.1%

let pokemonCards = [];

fetch('../assets/pokemon.json')
	.then((response) => {
		if (!response.ok) throw new Error('Failed to load JSON');
		return response.json();
	})
	.then((pokemonList) => {
		pokemonCards = pokemonList.map((pokemon) => new Card(pokemon.id, pokemon.name, pokemon.rarity));
	})
	.catch((err) => console.error(err));

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCard() {
	const rarityRoll = Math.random() * 100;
	let rarity;

	switch (true) {
		case rarityRoll < 72.5:
			rarity = 0; // Common
			break;
		case rarityRoll < 92.5:
			rarity = 1; // Uncommon
			break;
		case rarityRoll < 97.5:
			rarity = 2; // Rare
			break;
		case rarityRoll < 99.6:
			rarity = 3; // Very Rare
			break;
		case rarityRoll < 99.9:
			rarity = 4; // Legendary
			break;
		default:
			rarity = 5; // Shrek
	}

	const filteredCards = pokemonCards.filter((card) => card.getRarity() === rarity);
	const randomIndex = getRandomInt(0, filteredCards.length - 1);
	return filteredCards[randomIndex];
}

async function generateRandomCards() {
	const cardsContainer = document.querySelector('.cards-container');
	cardsContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouvelles cartes

	const cards = [];

	while (cards.length < 5) {
		const newCard = generateCard();
		cards.push(newCard);
	}

	// Créer des éléments HTML pour chaque carte et récupérer les infos via l'API
	for (const card of cards) {
		const cardElement = document.createElement('div');
		cardElement.classList.add('card');
		cardElement.innerHTML = `
            <div class="card-header">
                <p class="card-name">${card.name}</p>
            </div>
            <div class="card-illustration">Loading...</div>
            <div class="card-body">
                <p>Rarity : ${getRarityName(card.rarity)}</p>
            </div>
        `;

		cardElement.addEventListener('click', () => {
			cardElement.classList.add('clicked');
		});

		// Ajouter la carte au conteneur avant de récupérer les données
		cardsContainer.appendChild(cardElement);

		try {
			// Récupérer les données du Pokémon via l'API
			const pokemonData = await fetchPokemonData(card.id);

			// Mettre à jour la carte avec les informations récupérées
			const illustration = cardElement.querySelector('.card-illustration');

			if (pokemonData.custom_image) {
				illustration.innerHTML = `
					<img src="${pokemonData.custom_image}" alt="${pokemonData.name}" />
				`;
			} else {
				illustration.innerHTML = `
                <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${card.id
									.toString()
									.padStart(3, '0')}.png" alt="${pokemonData.name}" />`;
			}

			const body = cardElement.querySelector('.card-body');
			body.innerHTML += `
                <p>Type : ${pokemonData.types.map((type) => type.type.name).join(', ')}</p>
                <p>Weight : ${pokemonData.weight / 10} kg</p>
                <p>Height : ${pokemonData.height / 10} m</p>
				<p>Abilities : ${pokemonData.abilities.map((ability) => ability.ability.name).join(', ')}</p>
            `;
		} catch (error) {
			console.error('Erreur lors de la récupération des données du Pokémon :', error);
			const illustration = cardElement.querySelector('.card-illustration');
			illustration.innerHTML = `<p>Loading error</p>`;
		}
	}
}

// Fonction pour récupérer les données du Pokémon depuis l'API PokéAPI
async function fetchPokemonData(pokemonId) {
	if (pokemonId === 0) {
		// Données fictives pour Shrek
		return {
			name: 'Shrek',
			custom_image: 'https://www.123-stickers.com/6071-thickbox/sticker-shrek.jpg',
			types: [{ type: { name: 'ground' } }],
			weight: 1500,
			height: 20,
		};
	}

	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
	if (!response.ok) {
		throw new Error(`Erreur HTTP ! statut : ${response.status}`);
	}
	return response.json();
}

function getRarityName(rarity) {
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
}

document.querySelector('.cut-line').addEventListener('click', () => {
	document.querySelector('.booster-container').classList.add('cutted');
	generateRandomCards();
});
