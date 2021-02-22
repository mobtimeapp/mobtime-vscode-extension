import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Header as HeaderUI } from './Header';
import { StoreProvider } from '../../StoreProvider';

export default {
  title: 'UI / Header',
  args: {

  }
} as Meta;

export const Header: Story = (props) => (
  <StoreProvider initialState={{ timerName: 'Test Name' }}>
    <div style={{ width: 300 }}>
      <HeaderUI {...props} />
    </div>
  </StoreProvider>
);