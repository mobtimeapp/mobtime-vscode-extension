import React, { memo, useCallback, useRef } from 'react';
import { useStore } from '../StoreProvider';
import styled from '@emotion/styled';
import { GoalType } from '../shared/eventTypes';
import { Checkbox } from './UI/Checkbox';
import { motion } from 'framer-motion';
import Reward, { RewardElement } from 'react-rewards';
import { EditText } from './UI/EditText';

interface GoalProps extends Partial<GoalType> {
  placeholder: string;
  isEditing?: boolean;
  onEditDone?: () => void;
}

const GoalWrapper = styled.div`
  display: flex;
  align-items: start;
  span {
    position: fixed !important;
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
  text,
  isEditing,
  onEditDone
}) => {
  const { dispatch, state } = useStore();
  const handleCheck = useCallback(() => {
    if (id) {
      dispatch({
        type: 'goals:update',
        goals: state.goals?.map(goal => (
          goal.id === id ? {
            ...goal,
            completed: !goal.completed
          } : goal
        ))
      });
    }
  }, [id, state.goals]);

  const handleGoalNameUpdate = useCallback((text: string) => {
    if (id) {
      dispatch({
        type: 'goals:update',
        goals: state.goals?.map(goal => (
          goal.id === id ? {
            ...goal,
            text
          } : goal
        ))
      });
    }
  }, [id, state.goals]);

  return (
    <GoalUI
      text={text}
      placeholder={placeholder}
      onClick={handleCheck}
      completed={completed}
      isEditing={isEditing}
      onEditDone={onEditDone}
      onGoalNameUpdate={handleGoalNameUpdate}
    />
  );
};

export const GoalUI: React.FC<GoalProps & { 
  onClick: (checked: boolean) => void;
  onGoalNameUpdate?: (goal: string) => void; 
}> = memo(({
  placeholder,
  completed,
  text,
  onClick,
  isEditing,
  onEditDone,
  onGoalNameUpdate
}) => {
  const rewardRef = useRef<RewardElement>(null);
  const onChange = useCallback((checked: boolean) => {
    onClick(checked);
    if (checked) {
      rewardRef.current?.rewardMe();
    }
  }, [rewardRef.current, onClick]);

  return (
    <GoalWrapper
      style={{
        pointerEvents: text ? 'auto' : 'none'
      }}
    >
      <Reward
        ref={(ref) => rewardRef.current = ref}
        type="confetti"
        config={{
          elementCount: 200,
          spread: 200,
          decay: 0.9,
          angle: 65,
          zIndex: 100,
        }}
      >
        <Checkbox checked={completed} onChange={onChange} />
      </Reward>
      <motion.h3
        style={{
          opacity: text ? 1 : 0.5,
          textDecorationThickness: 3,
          marginTop: 4
        }}
        variants={{
          checked: {
            textDecorationLine: 'line-through',
            rotateX: 0,
          },
          noChecked: {
            textDecorationLine: 'none',
            rotateX: 0,
          }
        }}
        key={text}
        initial={{ rotateX: -90 }}
        animate={completed ? 'checked' : 'noChecked'}
      >
         {isEditing ? (
          <EditText 
            defaultText={text} 
            onDone={onEditDone}
            onChange={onGoalNameUpdate} 
          />) : 
          (text || placeholder)
        }
      </motion.h3>
    </GoalWrapper>
  );
});
