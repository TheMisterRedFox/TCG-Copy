import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardHeader from '@/components/card/CardHeader.vue';

describe('Card header', () => {
	it('mounts without errors', () => {
		const wrapper = mount(CardHeader);
		expect(wrapper.exists()).toBe(true);
	});
});
