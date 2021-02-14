import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { MobName } from './MobName';

export default {
  title: 'UI / MobName',
  args: {

  }
} as Meta;

export const named: Story = () => (
  <MobName name="Test" index={1}/>
);

export const Empty: Story = () => (
  <MobName type="Navigator" index={1} />
);
