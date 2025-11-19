import { Card } from './entities/card.js';

const pokemonList = [
	{ id: 1, name: 'Bulbizarre', rarity: 1 },
	{ id: 2, name: 'Herbizarre', rarity: 1 },
	{ id: 3, name: 'Florizarre', rarity: 3 },
	{ id: 4, name: 'Salamèche', rarity: 1 },
	{ id: 5, name: 'Reptincel', rarity: 2 },
	{ id: 6, name: 'Dracaufeu', rarity: 4 },
	{ id: 7, name: 'Carapuce', rarity: 1 },
	{ id: 8, name: 'Carabaffe', rarity: 2 },
	{ id: 9, name: 'Tortank', rarity: 3 },
	{ id: 10, name: 'Chenipan', rarity: 0 },
	{ id: 11, name: 'Chrysacier', rarity: 0 },
	{ id: 12, name: 'Papilusion', rarity: 1 },
	{ id: 13, name: 'Aspicot', rarity: 0 },
	{ id: 14, name: 'Coconfort', rarity: 0 },
	{ id: 15, name: 'Dardargnan', rarity: 1 },
	{ id: 16, name: 'Roucool', rarity: 0 },
	{ id: 17, name: 'Roucoups', rarity: 1 },
	{ id: 18, name: 'Roucarnage', rarity: 2 },
	{ id: 19, name: 'Rattata', rarity: 0 },
	{ id: 20, name: 'Rattatac', rarity: 1 },
	{ id: 21, name: 'Piafabec', rarity: 0 },
	{ id: 22, name: 'Rapasdepic', rarity: 1 },
	{ id: 23, name: 'Abo', rarity: 0 },
	{ id: 24, name: 'Arbok', rarity: 1 },
	{ id: 25, name: 'Pikachu', rarity: 2 },
	{ id: 26, name: 'Raichu', rarity: 2 },
	{ id: 27, name: 'Sabelette', rarity: 0 },
	{ id: 28, name: 'Sablaireau', rarity: 1 },
	{ id: 29, name: 'Nidoran♀', rarity: 0 },
	{ id: 30, name: 'Nidorina', rarity: 1 },
	{ id: 31, name: 'Nidoqueen', rarity: 3 },
	{ id: 32, name: 'Nidoran♂', rarity: 0 },
	{ id: 33, name: 'Nidorino', rarity: 1 },
	{ id: 34, name: 'Nidoking', rarity: 3 },
	{ id: 35, name: 'Mélofée', rarity: 1 },
	{ id: 36, name: 'Mélodelfe', rarity: 2 },
	{ id: 37, name: 'Goupix', rarity: 1 },
	{ id: 38, name: 'Feunard', rarity: 3 },
	{ id: 39, name: 'Rondoudou', rarity: 0 },
	{ id: 40, name: 'Grodoudou', rarity: 1 },
	{ id: 41, name: 'Nosferapti', rarity: 0 },
	{ id: 42, name: 'Nosferalto', rarity: 1 },
	{ id: 43, name: 'Mystherbe', rarity: 0 },
	{ id: 44, name: 'Ortide', rarity: 1 },
	{ id: 45, name: 'Rafflesia', rarity: 2 },
	{ id: 46, name: 'Paras', rarity: 0 },
	{ id: 47, name: 'Parasect', rarity: 1 },
	{ id: 48, name: 'Mimitoss', rarity: 0 },
	{ id: 49, name: 'Aéromite', rarity: 1 },
	{ id: 50, name: 'Taupiqueur', rarity: 0 },
	{ id: 51, name: 'Triopikeur', rarity: 1 },
	{ id: 52, name: 'Miaouss', rarity: 0 },
	{ id: 53, name: 'Persian', rarity: 1 },
	{ id: 54, name: 'Psykokwak', rarity: 0 },
	{ id: 55, name: 'Akwakwak', rarity: 1 },
	{ id: 56, name: 'Férosinge', rarity: 0 },
	{ id: 57, name: 'Colossinge', rarity: 1 },
	{ id: 58, name: 'Caninos', rarity: 1 },
	{ id: 59, name: 'Arcanin', rarity: 3 },
	{ id: 60, name: 'Ptitard', rarity: 0 },
	{ id: 61, name: 'Têtarte', rarity: 1 },
	{ id: 62, name: 'Tartard', rarity: 2 },
	{ id: 63, name: 'Abra', rarity: 0 },
	{ id: 64, name: 'Kadabra', rarity: 1 },
	{ id: 65, name: 'Alakazam', rarity: 3 },
	{ id: 66, name: 'Machoc', rarity: 0 },
	{ id: 67, name: 'Machopeur', rarity: 1 },
	{ id: 68, name: 'Mackogneur', rarity: 2 },
	{ id: 69, name: 'Chétiflor', rarity: 0 },
	{ id: 70, name: 'Boustiflor', rarity: 1 },
	{ id: 71, name: 'Empiflor', rarity: 2 },
	{ id: 72, name: 'Tentacool', rarity: 0 },
	{ id: 73, name: 'Tentacruel', rarity: 2 },
	{ id: 74, name: 'Racaillou', rarity: 0 },
	{ id: 75, name: 'Gravalanch', rarity: 1 },
	{ id: 76, name: 'Grolem', rarity: 2 },
	{ id: 77, name: 'Ponyta', rarity: 1 },
	{ id: 78, name: 'Galopa', rarity: 2 },
	{ id: 79, name: 'Ramoloss', rarity: 0 },
	{ id: 80, name: 'Flagadoss', rarity: 2 },
	{ id: 81, name: 'Magnéti', rarity: 0 },
	{ id: 82, name: 'Magnéton', rarity: 1 },
	{ id: 83, name: 'Canarticho', rarity: 1 },
	{ id: 84, name: 'Doduo', rarity: 0 },
	{ id: 85, name: 'Dodrio', rarity: 1 },
	{ id: 86, name: 'Otaria', rarity: 0 },
	{ id: 87, name: 'Lamantine', rarity: 2 },
	{ id: 88, name: 'Tadmorv', rarity: 0 },
	{ id: 89, name: 'Grotadmorv', rarity: 1 },
	{ id: 90, name: 'Kokiyas', rarity: 0 },
	{ id: 91, name: 'Crustabri', rarity: 2 },
	{ id: 92, name: 'Fantominus', rarity: 0 },
	{ id: 93, name: 'Spectrum', rarity: 1 },
	{ id: 94, name: 'Ectoplasma', rarity: 3 },
	{ id: 95, name: 'Onix', rarity: 1 },
	{ id: 96, name: 'Soporifik', rarity: 0 },
	{ id: 97, name: 'Hypnomade', rarity: 1 },
	{ id: 98, name: 'Krabby', rarity: 0 },
	{ id: 99, name: 'Krabboss', rarity: 1 },
	{ id: 100, name: 'Voltorbe', rarity: 0 },
	{ id: 101, name: 'Électrode', rarity: 1 },
	{ id: 102, name: 'Noeunoeuf', rarity: 0 },
	{ id: 103, name: 'Noadkoko', rarity: 2 },
	{ id: 104, name: 'Osselait', rarity: 0 },
	{ id: 105, name: 'Ossatueur', rarity: 1 },
	{ id: 106, name: 'Kicklee', rarity: 2 },
	{ id: 107, name: 'Tygnon', rarity: 2 },
	{ id: 108, name: 'Excelangue', rarity: 1 },
	{ id: 109, name: 'Smogo', rarity: 0 },
	{ id: 110, name: 'Smogogo', rarity: 1 },
	{ id: 111, name: 'Rhinocorne', rarity: 0 },
	{ id: 112, name: 'Rhinoféros', rarity: 2 },
	{ id: 113, name: 'Leveinard', rarity: 3 },
	{ id: 114, name: 'Saquedeneu', rarity: 1 },
	{ id: 115, name: 'Kangourex', rarity: 3 },
	{ id: 116, name: 'Hypotrempe', rarity: 0 },
	{ id: 117, name: 'Hypocéan', rarity: 1 },
	{ id: 118, name: 'Poissirène', rarity: 0 },
	{ id: 119, name: 'Poissoroy', rarity: 1 },
	{ id: 120, name: 'Stari', rarity: 0 },
	{ id: 121, name: 'Staross', rarity: 2 },
	{ id: 122, name: 'M. Mime', rarity: 2 },
	{ id: 123, name: 'Insécateur', rarity: 3 },
	{ id: 124, name: 'Lippoutou', rarity: 1 },
	{ id: 125, name: 'Élektek', rarity: 2 },
	{ id: 126, name: 'Magmar', rarity: 2 },
	{ id: 127, name: 'Scarabrute', rarity: 3 },
	{ id: 128, name: 'Tauros', rarity: 2 },
	{ id: 129, name: 'Magicarpe', rarity: 0 },
	{ id: 130, name: 'Léviator', rarity: 3 },
	{ id: 131, name: 'Lokhlass', rarity: 3 },
	{ id: 132, name: 'Métamorph', rarity: 2 },
	{ id: 133, name: 'Évoli', rarity: 2 },
	{ id: 134, name: 'Aquali', rarity: 3 },
	{ id: 135, name: 'Voltali', rarity: 3 },
	{ id: 136, name: 'Pyroli', rarity: 3 },
	{ id: 137, name: 'Porygon', rarity: 2 },
	{ id: 138, name: 'Amonita', rarity: 1 },
	{ id: 139, name: 'Amonistar', rarity: 2 },
	{ id: 140, name: 'Kabuto', rarity: 1 },
	{ id: 141, name: 'Kabutops', rarity: 2 },
	{ id: 142, name: 'Ptéra', rarity: 3 },
	{ id: 143, name: 'Ronflex', rarity: 2 },
	{ id: 144, name: 'Artikodin', rarity: 4 },
	{ id: 145, name: 'Électhor', rarity: 4 },
	{ id: 146, name: 'Sulfura', rarity: 4 },
	{ id: 147, name: 'Minidraco', rarity: 1 },
	{ id: 148, name: 'Draco', rarity: 2 },
	{ id: 149, name: 'Dracolosse', rarity: 4 },
	{ id: 150, name: 'Mewtwo', rarity: 4 },
	{ id: 151, name: 'Mew', rarity: 4 },
];

// rareté 0 : Commun : 72.5%
// rareté 1 : Peu commun: 20%
// rareté 2 : Rare: 5%
// rareté 3 : Très rare : 2%
// rareté 4 : Légendaire : 0.5%

const pokemonCards = pokemonList.map(
	(pokemon) => new Card(pokemon.id, pokemon.name, pokemon.rarity),
);

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCard() {
	const rarityRoll = Math.random() * 100;
	let rarity;

	if (rarityRoll < 72.5) {
		rarity = 0; // Commun
	} else if (rarityRoll < 92.5) {
		rarity = 1; // Peu commun
	} else if (rarityRoll < 97.5) {
		rarity = 2; // Rare
	} else if (rarityRoll < 99.5) {
		rarity = 3; // Très rare
	} else {
		rarity = 4; // Légendaire
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
		cardElement.classList.add('rarity-' + card.rarity);
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

			cardElement.classList.add('type-' + pokemonData.types[0].type.name);

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
