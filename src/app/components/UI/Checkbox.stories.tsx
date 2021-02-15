import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Checkbox as CheckboxUI, CheckboxProps } from './Checkbox';

export default {
  title: 'UI / Checkbox',
  args: {

  }
} as Meta;

export const Checkbox: Story<CheckboxProps> = (props) => {
  const [check, setCheck] = useState(true);
  return (
    <CheckboxUI checked={check} onChange={setCheck}/>
  );
};
