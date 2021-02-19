import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';;
import { StoreProvider } from './StoreProvider';
import { App } from "./App";

export default {
  title: 'App',
  args: {

  }
} as Meta;

export const Connected: Story = () => {
  return (
    <StoreProvider
      initialState={{
        timerName: 'test',
        settings: {
          duration: 6000,
          mobOrder: 'Navigator,Driver'
        }
      }}
    >
      <div style={{ width: 350 }}>
        <App />
      </div>
    </StoreProvider>
  );
};
