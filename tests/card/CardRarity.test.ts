import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardRarity from '@/components/card/CardRarity.vue';

describe('Card header', () => {
	it('mounts without errors', () => {
		const wrapper = mount(CardRarity);
		expect(wrapper.exists()).toBe(true);
	});
});
