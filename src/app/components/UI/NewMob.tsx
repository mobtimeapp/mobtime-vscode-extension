import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Store } from '../../shared/eventTypes';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Button } from "./Button";

interface NewMobProps {
  onMobAdd?: (mob: Store['mob'][number]) => void 
}

const MotionBtn = motion.custom(Button);

export const NewMob: React.FC<NewMobProps> = ({ onMobAdd }) =>{
  const [mobName, setMobName] = useState('');
  const handleAdd = useCallback(() => {
    if (mobName && onMobAdd) {
      onMobAdd({
        id: (+new Date()).toString(),
        name: mobName
      });
      setMobName('');
    }
  }, [mobName, onMobAdd]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 5
      }}
    >
      <input
        onChange={e => setMobName(e.target.value)}
        value={mobName}
        placeholder="Add New Mob"
      />
      <MotionBtn
        onClick={handleAdd}
        style={{
          maxWidth: 100
        }}
        initial={{
          x: -50,
          opacity: 0
        }}
        animate={{
          x: mobName ? 0 : -50,
          opacity: mobName ? 1 : 0
        }}
        transition={{
          duration: 0.25
        }}
      >
        <AiOutlineUserAdd />
        Add
      </MotionBtn>
    </div>
  );
};