import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Booster from '@/components/booster/Booster.vue';

describe('Booster.vue', () => {
	it('mounts without errors', () => {
		const wrapper = mount(Booster);
		expect(wrapper.exists()).toBe(true);
	});
});
