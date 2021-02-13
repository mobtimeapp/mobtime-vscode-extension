import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Loader as LoaderUI } from './Loader';

export default {
  title: 'UI / Loader',
  args: {

  }
} as Meta;

export const Loader: Story = (props) => (
  <div style={{ width: 300 }}>
    <LoaderUI />
  </div>
);