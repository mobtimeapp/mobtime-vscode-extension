import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Button as ButtonUI } from './Button';

export default {
  title: 'UI / Button',
  args: {

  }
} as Meta;

export const Button: Story = (props) => (
  <div style={{ width: 300 }}>
    <ButtonUI {...props}>
      Hello Button
    </ButtonUI>
  </div>
);