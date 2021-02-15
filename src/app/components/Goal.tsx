import React, { useCallback } from 'react';
import { useStore } from '../StoreProvider';
import styled from '@emotion/styled';
import { GoalType } from '../shared/eventTypes';
import { Checkbox } from './UI/Checkbox';
import { animate, motion } from 'framer-motion';
import { Checkout } from './UI/Checkout';

interface GoalProps extends Partial<GoalType> {
  placeholder: string
}

const GoalWrapper = styled.div`
  display: flex;
  align-items: start;
  svg {
    margin-top: 2px;
    min-width: 20px;
    min-height: 20px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export const Goal: React.FC<GoalProps> = ({
  placeholder,
  completed,
  id,
  text
}) => {
  const { dispatch, state } = useStore();
  const handleCheck = useCallback(() => {
    if (id) {
      dispatch({
        type: 'goals:update',
        goals: state.goals?.map(goal => (
          goal.id === id ? {
            ...goal,
            completed: !completed
          } : goal
        ))
      });
    }
  }, [id, completed]);

  return (
    <GoalUI
      text={text}
      placeholder={placeholder}
      onClick={handleCheck}
      completed={completed}
    />
  );
};

export const GoalUI: React.FC<GoalProps & { onClick: () => void }> = ({
  placeholder,
  completed,
  text,
  onClick
}) => {

  return (
    <GoalWrapper>
      <Checkbox checked={completed} onChange={onClick} />
      <motion.h2
        style={{
          opacity: text ? 1 : 0.5,
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={false}
        animate={completed ? 'checked' : 'noChecked'}
      >
        {(text || placeholder)}
        <Checkout />
      </motion.h2>
    </GoalWrapper>
  );
};