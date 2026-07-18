import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardRarity from '@/components/card/CardRarity.vue';

describe('CardRarity.vue', () => {
	it('renders a question mark when rarity is undefined', () => {
		const wrapper = mount(CardRarity);
		expect(wrapper.text()).toContain('❔');
	});

	it.each([
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
	])('renders %i+1 diamond(s) for rarity %i', (rarity, expectedCount) => {
		const wrapper = mount(CardRarity, { props: { rarity } });
		expect(wrapper.findAll('span span').length).toBe(expectedCount);
	});

	it('renders a star for rarity 4', () => {
		const wrapper = mount(CardRarity, { props: { rarity: 4 } });
		expect(wrapper.text()).toContain('🌟');
	});

	it('renders a nauseated face for rarity 5', () => {
		const wrapper = mount(CardRarity, { props: { rarity: 5 } });
		expect(wrapper.text()).toContain('🤢');
	});
});
