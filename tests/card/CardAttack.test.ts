import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CardAttack from '@/components/card/CardAttack.vue';
import type { Attack } from '@/interface/GeneralTypes';

describe('CardAttack', () => {
  it('mounts without errors', () => {
    const mockAttack: Attack = {
      name: 'Attack Name',
      power: 0,
      energy: ['Energy 1', 'Energy 2'],
      type: 'Type',
    };

    const wrapper = mount(CardAttack, {
      props: {
        attack: mockAttack,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
