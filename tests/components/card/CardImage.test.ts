import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardImage from '@/components/card/CardImage.vue';

describe('Card header', () => {
	it('mounts without errors', () => {
		const wrapper = mount(CardImage);
		expect(wrapper.exists()).toBe(true);
	});
});
