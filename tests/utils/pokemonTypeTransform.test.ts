import { describe, expect, it } from 'vitest';
import { OriginalPokemonTypesEnum } from '@/enums/pokemonTypesEnum';
import { pokemonTypeTransform } from '@/utils/pokemonTypeTransform';

describe('pokemonTypeTransform', () => {
	it('should return the original enum value when type is valid', () => {
		expect(pokemonTypeTransform('fire')).toBe(OriginalPokemonTypesEnum.FIRE);
		expect(pokemonTypeTransform('WATER')).toBe(OriginalPokemonTypesEnum.WATER);
		expect(pokemonTypeTransform('psychic')).toBe(
			OriginalPokemonTypesEnum.PSYCHIC,
		);
	});

	it('should handle fallback mappings correctly', () => {
		expect(pokemonTypeTransform('bird')).toBe(OriginalPokemonTypesEnum.NORMAL);
		expect(pokemonTypeTransform('bug')).toBe(OriginalPokemonTypesEnum.GRASS);
		expect(pokemonTypeTransform('flying')).toBe(
			OriginalPokemonTypesEnum.NORMAL,
		);
		expect(pokemonTypeTransform('ghost')).toBe(
			OriginalPokemonTypesEnum.PSYCHIC,
		);
		expect(pokemonTypeTransform('ground')).toBe(
			OriginalPokemonTypesEnum.FIGHTING,
		);
		expect(pokemonTypeTransform('ice')).toBe(OriginalPokemonTypesEnum.WATER);
		expect(pokemonTypeTransform('poison')).toBe(
			OriginalPokemonTypesEnum.PSYCHIC,
		);
		expect(pokemonTypeTransform('rock')).toBe(
			OriginalPokemonTypesEnum.FIGHTING,
		);
		expect(pokemonTypeTransform('fairy')).toBe(
			OriginalPokemonTypesEnum.PSYCHIC,
		);
	});

	it('should be case-insensitive', () => {
		expect(pokemonTypeTransform('BiRd')).toBe(OriginalPokemonTypesEnum.NORMAL);
		expect(pokemonTypeTransform('BUG')).toBe(OriginalPokemonTypesEnum.GRASS);
	});

	it('should return NULL for unknown types', () => {
		expect(pokemonTypeTransform('shadow')).toBe(OriginalPokemonTypesEnum.NULL);
		expect(pokemonTypeTransform('')).toBe(OriginalPokemonTypesEnum.NULL);
		expect(pokemonTypeTransform('not-a-type')).toBe(
			OriginalPokemonTypesEnum.NULL,
		);
	});
});
