import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { StoreProvider } from '../StoreProvider';
import { Overview } from './Overview';

export default {
  title: 'Sections / Overview',
  args: {

  }
} as Meta;

export const OverviewEmpty: Story = () => {
  return (
    <StoreProvider >
      <div style={{ width: 300 }}>
        <Overview />
      </div>
    </StoreProvider>
  );
};


export const OverviewFull: Story = () => {
  return (
    <StoreProvider
      initialState={{
        mob: [
          { id: '1', name: 'Name A' },
          { id: '2', name: 'Name B' }
        ],
        goals: [
          { id: '1', text: 'Goals A', completed: false },
          { id: '2', text: 'Goals B', completed: true }
        ]
      }}
    >
      <div style={{ width: 300 }}>
        <Overview />
      </div>
    </StoreProvider>
  );
};
