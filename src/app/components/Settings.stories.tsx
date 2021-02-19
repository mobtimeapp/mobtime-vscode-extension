import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { StoreProvider } from '../StoreProvider';
import { Settings as SettingsUI } from './Settings';

export default {
  title: 'Sections / Settings',
  args: {

  }
} as Meta;

export const Settings: Story = () => {
  return (
    <StoreProvider
      initialState={{
        settings: {
          duration: 300000,
          mobOrder: 'Navigator,Driver'
        }
      }}
    >
      <div style={{ width: 300 }}>
        <SettingsUI />
      </div>
    </StoreProvider>
  );
};