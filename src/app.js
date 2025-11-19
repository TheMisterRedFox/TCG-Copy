import { Card } from './entities/card.js';

// rareté 0 : Commun : 72.5%
// rareté 1 : Peu commun: 20%
// rareté 2 : Rare: 5%
// rareté 3 : Très rare : 2%
// rareté 4 : Légendaire : 0.5%
// rareté 5 : Shrek : 0.01%

let pokemonCards = [];

fetch('../assets/pokemon.json')
	.then((response) => {
		if (!response.ok) throw new Error('Failed to load JSON');
		return response.json();
	})
	.then((pokemonList) => {
		pokemonCards = pokemonList.map(
			(pokemon) => new Card(pokemon.id, pokemon.name, pokemon.rarity),
		);
	})
	.catch((err) => console.error(err));

// const pokemonCards = pokemonList.map((pokemon) => new Card(pokemon.id, pokemon.name, pokemon.rarity));

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCard() {
	const rarityRoll = Math.random() * 100;
	let rarity;

	switch (true) {
		case rarityRoll < 72.5:
			rarity = 0; // Commun
			break;
		case rarityRoll < 92.5:
			rarity = 1; // Peu commun
			break;
		case rarityRoll < 97.5:
			rarity = 2; // Rare
			break;
		case rarityRoll < 99.5:
			rarity = 3; // Très rare
			break;
		case rarityRoll < 99.99:
			rarity = 4; // Légendaire
			break;
		default:
			rarity = 5; // Shrek
	}

	const filteredCards = pokemonCards.filter(
		(card) => card.getRarity() === rarity,
	);
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
            <div class="card-illustration">Chargement...</div>
            <div class="card-body">
                <p>Rareté : ${getRarityName(card.rarity)}</p>
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
			illustration.innerHTML = `
                <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${card.id.toString().padStart(3, '0')}.png" alt="${pokemonData.name}" />
            `;

			const body = cardElement.querySelector('.card-body');
			body.innerHTML += `
                <p>Type : ${pokemonData.types.map((type) => type.type.name).join(', ')}</p>
                <p>Poids : ${pokemonData.weight / 10} kg</p>
                <p>Taille : ${pokemonData.height / 10} m</p>
            `;
		} catch (error) {
			console.error(
				'Erreur lors de la récupération des données du Pokémon :',
				error,
			);
			const illustration = cardElement.querySelector('.card-illustration');
			illustration.innerHTML = `<p>Erreur de chargement</p>`;
		}
	}
}

// Fonction pour récupérer les données du Pokémon depuis l'API PokéAPI
async function fetchPokemonData(pokemonId) {
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
	);
	if (!response.ok) {
		throw new Error(`Erreur HTTP ! statut : ${response.status}`);
	}
	return response.json();
}

function getRarityName(rarity) {
	switch (rarity) {
		case 0:
			return 'Commun';
		case 1:
			return 'Peu commun';
		case 2:
			return 'Rare';
		case 3:
			return 'Très rare';
		case 4:
			return 'Légendaire';
		default:
			return 'Inconnu';
	}
}

document.querySelector('.cut-line').addEventListener('click', () => {
	document.querySelector('.booster-container').classList.add('cutted');
	generateRandomCards();
});
