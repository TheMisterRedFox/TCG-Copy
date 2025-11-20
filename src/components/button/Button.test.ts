import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Button from '@/components/button/Button.vue';

describe('Button.vue', () => {
	it('renders slot content', () => {
		const wrapper = mount(Button, {
			slots: {
				default: 'Click Me',
			},
		});

		expect(wrapper.text()).toBe('Click Me');
	});

	it('emits a click event when clicked', async () => {
		const wrapper = mount(Button, {
			slots: { default: 'Test' },
		});

		await wrapper.trigger('click');

		expect(wrapper.emitted()).toHaveProperty('click');
		expect(wrapper.emitted('click')!.length).toBe(1);
	});

	it('is a button element', () => {
		const wrapper = mount(Button);
		expect(wrapper.element.tagName).toBe('BUTTON');
	});
});
