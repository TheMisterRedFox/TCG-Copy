import { OriginalPokemonTypesEnum } from '@/enums/pokemonTypesEnum';

/**
 * Mapping of "deprecated" or non-canonical types
 * to the closest OriginalPokemonTypesEnum equivalent.
 */
const fallbackTypeMap: Record<string, OriginalPokemonTypesEnum> = {
	// V1
	bird: OriginalPokemonTypesEnum.NORMAL,
	bug: OriginalPokemonTypesEnum.GRASS,
	flying: OriginalPokemonTypesEnum.NORMAL,
	ghost: OriginalPokemonTypesEnum.PSYCHIC,
	ground: OriginalPokemonTypesEnum.FIGHTING,
	ice: OriginalPokemonTypesEnum.WATER,
	poison: OriginalPokemonTypesEnum.PSYCHIC,
	rock: OriginalPokemonTypesEnum.FIGHTING,
	fairy: OriginalPokemonTypesEnum.PSYCHIC,
	// V2
	colorless: OriginalPokemonTypesEnum.NORMAL,
	lightning: OriginalPokemonTypesEnum.ELECTRIC,
};

/**
 * Transforms a given Pokémon type string into a valid OriginalPokemonTypesEnum value
 * @param {string} type - The Pokémon type to transform
 * @returns {OriginalPokemonTypesEnum} The normalized or mapped Pokémon type enum
 */
export const pokemonTypeTransform = (
	type: string,
): OriginalPokemonTypesEnum => {
	const lowerType = type.toLowerCase();

	// If the type is already a valid OriginalPokemonTypesEnum, return it directly
	if (
		Object.values(OriginalPokemonTypesEnum).includes(
			lowerType as OriginalPokemonTypesEnum,
		)
	) {
		return lowerType as OriginalPokemonTypesEnum;
	}

	// Check if there's a fallback mapping for the given type
	if (fallbackTypeMap[lowerType]) {
		return fallbackTypeMap[lowerType];
	}

	// Final fallback to NULL if no match is found
	return OriginalPokemonTypesEnum.NULL;
};
