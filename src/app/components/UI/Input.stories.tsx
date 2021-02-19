import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Input as InputUI } from './Input';

export default {
  title: 'UI / Input',
  args: {

  }
} as Meta;

export const Input: Story = () => (
  <div style={{ width: 300 }}>
    <InputUI errorMessage="Invalid Input"/>
  </div>
);