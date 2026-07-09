import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardImage from '@/components/card/CardImage.vue';

describe('CardImage.vue', () => {
	it('renders the provided image when given', () => {
		const wrapper = mount(CardImage, {
			props: { id: 4, name: 'Charmander', image: '/shrek.jpg' },
		});

		const img = wrapper.find('img');
		expect(img.attributes('src')).toBe('/shrek.jpg');
		expect(img.attributes('alt')).toBe('Charmander');
	});

	it('falls back to the PokeAPI official art URL when no image is provided', () => {
		const wrapper = mount(CardImage, {
			props: { id: 4, name: 'Charmander' },
		});

		const img = wrapper.find('img');
		expect(img.attributes('src')).toBe(
			'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
		);
		expect(img.attributes('alt')).toBe('Charmander');
	});

	it('lazy-loads the image and reserves layout space via width/height', () => {
		const wrapper = mount(CardImage, {
			props: { id: 1, name: 'Bulbasaur' },
		});

		const img = wrapper.find('img');
		expect(img.attributes('loading')).toBe('lazy');
		expect(img.attributes('width')).toBe('150');
		expect(img.attributes('height')).toBe('150');
	});
});
