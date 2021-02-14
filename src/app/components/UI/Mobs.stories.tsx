import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Mobs as MobsList } from './Mobs';
import { Store } from "../../../app/shared/eventTypes";

export default {
  title: 'Sections / Mobs',
  args: {

  }
} as Meta;

export const Empty: Story = () => {
  const [mobs, setMobs] = useState<Store['mob']>([]);

  return (
    <MobsList 
      mobs={mobs}
      onUpdateMobs={setMobs}
      order="Navigator,Driver"
    />
  );
};

export const FullList: Story = () => {
  const [mobs, setMobs] = useState<Store['mob']>([
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
  ]);

  return (
    <MobsList 
      mobs={mobs}
      onUpdateMobs={setMobs}
      order="Navigator,Driver"
    />
  );
};