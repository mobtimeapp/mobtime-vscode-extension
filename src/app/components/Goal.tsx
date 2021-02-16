import React, { useCallback, useRef } from 'react';
import { useStore } from '../StoreProvider';
import styled from '@emotion/styled';
import { GoalType } from '../shared/eventTypes';
import { Checkbox } from './UI/Checkbox';
import { motion } from 'framer-motion';
import { Checkout } from './UI/Checkout';
import Reward, { RewardElement } from 'react-rewards';

interface GoalProps extends Partial<GoalType> {
  placeholder: string
}

const GoalWrapper = styled(motion.div)`
  display: flex;
  align-items: start;
  span {
    position: fixed
  }
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
  const rewardRef = useRef<RewardElement>(null);
  const onChange = (completed: boolean) => {
    if (completed) {
      rewardRef.current?.rewardMe();
    }
    onClick();
  };

  return (
    <GoalWrapper
      initial={false}
      animate={completed ? 'checked' : 'noChecked'}
    >
      <Reward
        ref={(ref) => rewardRef.current = ref}
        type="confetti"
        config={{
          lifetime: 80,
          elementCount: 50,
          spread: 150,
          decay: 0.8,
          angle: 45,
          zIndex: 100,
        }}
      >
        <Checkbox checked={completed} onChange={onChange} />
      </Reward>
      <motion.h2
        style={{
          opacity: text ? 1 : 0.5,
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={false}
      >
        {(text || placeholder)}
        <Checkout />
      </motion.h2>
    </GoalWrapper>
  );
};