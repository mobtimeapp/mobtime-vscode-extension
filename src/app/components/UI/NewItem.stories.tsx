import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { NewItem } from './NewItem';
import { AiFillFileAdd } from 'react-icons/ai';

export default {
  title: 'UI / New Mob',
  args: {

  }
} as Meta;

export const Primary: Story = () => (
  <NewItem Icon={AiFillFileAdd} placeholder="Add" />
);
