import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Goals } from './Goals';
import { StoreProvider } from '../StoreProvider';

export default {
  title: 'Sections / Goals',
  args: {

  }
} as Meta;

export const preAdded: Story = () => {
  return (
    <StoreProvider
      initialState={{
        goals: [
          {
            completed: false,
            id: '1',
            text: 'Goal A'
          },
          {
            completed: false,
            id: '2',
            text: 'Goal B'
          },
          {
            completed: true,
            id: '3',
            text: 'Goal C'
          }
        ]
      }}
    >
      <div style={{ width: 300 }}>
        <Goals />
      </div>
    </StoreProvider>
  );
};
