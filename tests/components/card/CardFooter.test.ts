import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardFooter from '@/components/card/CardFooter.vue';

describe('CardFooter.vue', () => {
	it('renders the card footer container', () => {
		const wrapper = mount(CardFooter);

		const container = wrapper.find('.card-footer');
		expect(container.exists()).toBe(true);
	});

	it('renders slot content', () => {
		const wrapper = mount(CardFooter, {
			slots: {
				default: '<span class="slot-content">Footer Content</span>',
			},
		});

		const slotContent = wrapper.find('.slot-content');
		expect(slotContent.exists()).toBe(true);
		expect(slotContent.text()).toBe('Footer Content');
	});
});
