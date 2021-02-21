import React, { memo, useMemo } from 'react';
import { motion, useCycle } from 'framer-motion';
import { IconType } from 'react-icons';
import styled from '@emotion/styled';
import { OptionIcon } from '../Icons/OptionIcon';

export const OptionsButton: React.FC<OptionsButtonProps> = memo(({ options }) => {
  const [open, toggleOpen] = useCycle('close', 'open');
  const filtered = useMemo(() => options.filter(o => !o.hidden), [options]);
  return (
    <div
      style={{ display: 'flex', paddingRight: 3 }}
    >
      {filtered.map((option, i) => (
        <IconButton
          className="secondary"
          variants={{
            open: {
              width: 25,
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
          onClick={(e) => {
            option.onClick();
            if (option.onClickClose) {
              toggleOpen();
              (e.target as HTMLButtonElement).blur();
            }
          }}
          initial={false}
          transition={{
            type: 'spring',
            duration: .5,
            bounce: 0,
          }}
        >
          <option.icon color={option.color} />
        </IconButton>
      ))}
      <IconButton
        onClick={() => toggleOpen()}
        initial="close"
        animate={open}
      >
        <OptionIcon />
      </IconButton>
    </div>
  );
});
interface OptionsButtonProps {
  options: {
    icon: IconType,
    onClick: () => void,
    onClickClose?: boolean,
    color?: string,
    hidden?: boolean
  }[];
}

export const IconButton = styled(motion.button)`
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 3;
  svg: {
    width: 20px;
    height: 20px;
    margin-right: 0 !important;
  }
`;
