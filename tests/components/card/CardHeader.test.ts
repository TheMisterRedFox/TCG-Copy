import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardHeader from '@/components/card/CardHeader.vue';

describe('CardHeader.vue', () => {
	it('renders the card header container', () => {
		const wrapper = mount(CardHeader);

		const container = wrapper.find('.card-header');
		expect(container.exists()).toBe(true);
	});

	it('renders the card name when provided', () => {
		const wrapper = mount(CardHeader, {
			props: {
				name: 'Charizard',
			},
		});

		const name = wrapper.find('.card-name');
		expect(name.exists()).toBe(true);
		expect(name.text()).toBe('Charizard');
	});

	it('renders default loading text when name is undefined', () => {
		const wrapper = mount(CardHeader);

		const name = wrapper.find('.card-name');
		expect(name.text()).toBe('Loading…');
	});

	it('renders slot content', () => {
		const wrapper = mount(CardHeader, {
			slots: {
				default: '<span class="slot-content">Header Slot</span>',
			},
		});

		const slotContent = wrapper.find('.slot-content');
		expect(slotContent.exists()).toBe(true);
		expect(slotContent.text()).toBe('Header Slot');
	});
});
