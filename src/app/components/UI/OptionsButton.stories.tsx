import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { OptionsButton } from './OptionsButton';
import { AiOutlineUserAdd } from 'react-icons/ai';

export default {
  title: 'UI / OptionsButton',
  args: {

  }
} as Meta;

export const Primary: Story = (props) => (
  <div style={{ width: 300 }}>
    <OptionsButton options={[
      { icon: AiOutlineUserAdd, onClick: () => {/** */} },
      { icon: AiOutlineUserAdd, onClick: () => {/** */} },
      { icon: AiOutlineUserAdd, onClick: () => {/** */} },
      { icon: AiOutlineUserAdd, onClick: () => {/** */} },
      { icon: AiOutlineUserAdd, onClick: () => {/** */} },
    ]} >
      Hello Button
    </OptionsButton>
  </div>
);