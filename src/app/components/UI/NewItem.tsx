import React, { useCallback, useEffect, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import { Button } from "./Button";
import { IconType } from 'react-icons';
import { Checkbox } from './Checkbox';

interface NewItemProps {
  onItemAdd?: (items: {
    id: string,
    text: string
  }[]) => void,
  placeholder?: string,
  Icon: IconType,
  addMultiple?: boolean,
  addMultipleLabel?: string,
  multipleItemPlaceholder?: string
}

const MotionBtn = motion.custom(Button);

export const NewItem: React.FC<NewItemProps> = ({ 
  onItemAdd,
  placeholder,
  Icon,
  addMultiple,
  addMultipleLabel,
  multipleItemPlaceholder
}) =>{
  const [itemText, setItemText] = useState('');
  const [isMultiple, toggleMultiple] = useCycle('single', 'mutiple');

  useEffect(() => {
    setItemText(text => 
      isMultiple === 'mutiple' ? 
      text 
      : text.replace(/(?:\r\n|\r|\n)/g, '')
    );
  }, [isMultiple, itemText]);

  const handleAdd = useCallback(() => {
    if (itemText && onItemAdd) {
      onItemAdd(
        itemText.split(/(?:\r\n|\r|\n)/).map((text, i) => ({
          id: `${i}${(+new Date()).toString()}`,
          text
        }))
      );
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
      <motion.textarea
        onChange={e => setItemText(e.target.value)}
        style={{ resize: 'none' }}
        placeholder={
          isMultiple === 'mutiple' ? 
          multipleItemPlaceholder
          : placeholder
        }
        value={itemText}
        initial={false}
        variants={{
          single: {
            height: 28,
            resize: 'none',
            overflow: 'hidden'
          },
          mutiple: {
            height: 3 * 28,
            resize: 'vertical'
          }
        }}
        animate={isMultiple}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        {addMultiple && (
          <Checkbox 
            checked={isMultiple === 'mutiple'}
            onChange={() => toggleMultiple()}
            label={addMultipleLabel}
            scale={0.8}
          />
        )}
      </div>
    </div>
  );
};