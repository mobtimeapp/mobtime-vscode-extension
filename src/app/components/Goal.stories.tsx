import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { GoalUI } from './Goal';

export default {
  title: 'UI / Goal',
  args: {

  }
} as Meta;

export const Goal: Story = () => {
  const [check, setCheck] = useState(true);
  return (
    <GoalUI
      onClick={() => setCheck(c => !c)}
      text="Some goal can be typed here, it can complete too."
      completed={check}
      placeholder=""
    />
  );
};
