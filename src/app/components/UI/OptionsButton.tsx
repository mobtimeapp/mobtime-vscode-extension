import React, { memo, useMemo } from 'react';
import { motion, useCycle } from 'framer-motion';
import { IconType } from 'react-icons';
import styled from '@emotion/styled';
import { OptionIcon } from '../Icons/OptionIcon';

interface OptionsButtonProps {
  options: {
    icon: IconType,
    onClick: () => void,
    color?: string,
    hidden?: boolean
  }[];
}

export const IconButton = styled.button`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  display: flex;
  svg: {
    width: 25px;
    height: 25px;
    margin-right: 0 !important;
  }
`;

const Button = motion.custom(IconButton);

export const OptionsButton: React.FC<OptionsButtonProps> = memo(({ options }) => {
  const [open, toggleOpen] = useCycle('close', 'open');
  const filterd = useMemo(() => options.filter(o => !o.hidden), [options]);
  return (
    <div
      style={{ display: 'flex', paddingRight: 3 }}
    >
      {filterd.map((option, i) => (
        <Button
          className="secondary"
          variants={{
            open: {
              width: 30,
              padding: `6px 4px`,
              marginRight: '5px',
              pointerEvents: 'all'
            },
            close: {
              width: 0,
              padding: `0px 0px`,
              marginRight: '0px ',
              pointerEvents: 'none'
            }
          }}
          key={i} 
          animate={open}
          onClick={option.onClick}
          initial={false}
          transition={{
            type: 'spring',
            duration: .5,
            bounce: 0,
          }}
        >
          <option.icon size="25px" color={option.color} />
        </Button>
      ))}
      <Button 
        style={{ width: '30px', zIndex: 3 }}
        onClick={() => toggleOpen()}
        initial="close"
        animate={open}
      >
        <OptionIcon />
      </Button>
    </div>
  );
});