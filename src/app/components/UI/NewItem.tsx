import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "./Button";
import { IconType } from 'react-icons';

interface NewItemProps {
  onItemAdd?: (item: {
    id: string,
    text: string
  }) => void,
  placeholder?: string,
  Icon: IconType
}

const MotionBtn = motion.custom(Button);

export const NewItem: React.FC<NewItemProps> = ({ onItemAdd, placeholder, Icon }) =>{
  const [itemText, setItemText] = useState('');
  const handleAdd = useCallback(() => {
    if (itemText && onItemAdd) {
      onItemAdd({
        id: (+new Date()).toString(),
        text: itemText
      });
      setItemText('');
    }
  }, [itemText, onItemAdd]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 5
      }}
    >
      <input
        onChange={e => setItemText(e.target.value)}
        value={itemText}
        placeholder={placeholder}
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
          x: itemText ? 0 : -50,
          opacity: itemText ? 1 : 0
        }}
        transition={{
          duration: 0.25
        }}
      >
        <Icon />
        Add
      </MotionBtn>
    </div>
  );
};