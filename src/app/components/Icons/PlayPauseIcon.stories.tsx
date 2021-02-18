import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { PlayPauseIcon } from './PlayPauseIcon';
import { useCycle } from 'framer-motion';
import { IconButton } from '../UI/OptionsButton';

export default {
  title: 'Icons / PlayPauseIcon',
  args: {

  }
} as Meta;

export const Button: Story = (props) =>{
  const [icon, toggleIcon] = useCycle<'play' | 'pause'>('play', 'pause');
  
  return (
    <IconButton onClick={() => toggleIcon()}>
      <PlayPauseIcon icon={icon}/>
    </IconButton>
  )
};