import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { NewMob } from './NewMob';

export default {
  title: 'UI / New Mob',
  args: {

  }
} as Meta;

export const Primary: Story = () => (
  <NewMob />
);
