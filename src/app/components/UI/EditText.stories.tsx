import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0'
import { EditText as EditTextUI } from './EditText';

export default {
  title: 'UI / EditInput',
  args: {

  }
} as Meta;

export const EditInput: Story = () => (
  <div style={{ width: 300 }}>
    <EditTextUI defaultText="SomeText" onDone={() => {}} onChange={console.log} />
  </div>
);