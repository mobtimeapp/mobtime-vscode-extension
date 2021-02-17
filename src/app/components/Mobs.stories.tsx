import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Mobs as MobsList } from './Mobs';
import { StoreProvider } from '../StoreProvider';

export default {
  title: 'Sections / Mobs',
  args: {

  }
} as Meta;

export const Empty: Story = () => {
  return (
    <StoreProvider>
      <div style={{ width: 300 }}>
        <MobsList />
      </div>
    </StoreProvider>
  );
};

export const FullList: Story = () => {
  return (
    <StoreProvider
      initialState={{
        mob: [
          {
            id: '123',
            name: 'Test A'
          },
          {
            id: '1234',
            name: 'Test B'
          },
          {
            id: '12345',
            name: 'Test C'
          },
          {
            id: '123456',
            name: 'Test D'
          },
          {
            id: '1234567',
            name: 'Test E'
          },
        ]
      }}
    >
      <div style={{ width: 300 }}>
        <MobsList />
      </div>
    </StoreProvider>
  );
};