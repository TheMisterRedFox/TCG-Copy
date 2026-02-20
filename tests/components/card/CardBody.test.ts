import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardBody from '@/components/card/CardBody.vue';

describe('CardBody.vue', () => {
	it('renders the card body container', () => {
		const wrapper = mount(CardBody);

		const container = wrapper.find('.card-body');
		expect(container.exists()).toBe(true);
	});

	it('renders slot content', () => {
		const wrapper = mount(CardBody, {
			slots: {
				default: '<p class="slot-content">Test Content</p>',
			},
		});

		const slotContent = wrapper.find('.slot-content');
		expect(slotContent.exists()).toBe(true);
		expect(slotContent.text()).toBe('Test Content');
	});
});
