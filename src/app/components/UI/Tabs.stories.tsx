import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Tabs as TabsUI } from './Tabs';
import { VscEye, VscTools } from 'react-icons/vsc';
import { FiUsers } from 'react-icons/fi';
import { BsCardChecklist } from 'react-icons/bs';

export default {
  title: 'UI / Tabs',
  args: {

  }
} as Meta;

export const Tabs: Story = (props) =>{
  const [activeIndex, setActiveIndex] = useState(0);
  return (
  <div style={{ width: 500 }}>
    <TabsUI 
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      tabs={[
      {
        icon: VscEye,
        label: 'Overview'
      },
      {
        icon: FiUsers,
        label: 'Mob'
      },
      {
        icon: BsCardChecklist,
        label: 'Goals'
      },
      {
        icon: VscTools,
        label: 'Settings'
      }
    ]} {...props}>
      <div 
        style={{
          display: 'block',
          height: '400px',
          width: '100%',
          backgroundColor: 'red'
        }}
      />
      <div 
        style={{
          display: 'block',
          height: '400px',
          width: '100%',
          backgroundColor: 'yellow'
        }}
      />
      <div 
        style={{
          display: 'block',
          height: '400px',
          width: '100%',
          backgroundColor: 'blue'
        }}
      />
      <div 
        style={{
          display: 'block',
          height: '400px',
          width: '100%',
          backgroundColor: 'green'
        }}
      />
    </TabsUI>
  </div>
);
}