import React, { useCallback } from 'react';
import { GoalType, useStore } from '../StoreProvider';
import styled from '@emotion/styled';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

interface GoalProps extends Partial<GoalType> {
  placeholder: string
}

const GoalWrapper = styled.div`
  display: flex;
  align-items: start;
  svg {
    cursor: pointer;
    margin-top: 2px;
    min-width: 20px;
    min-height: 20px;
    margin-right: 10px;
    margin-bottom: 10px;
    polyline {
      stroke: var(--vscode-terminal-ansiBrightGreen);
    }
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
    <GoalWrapper>
      {completed ? 
        <FiCheckCircle onClick={handleCheck}/> : 
        <FiCircle onClick={handleCheck}/>
      }
      <h2
        style={{
          textDecoration: completed ? 'line-through' : 'none',
          opacity: text ? 1 : 0.5
        }}
      >
        {text || placeholder}
      </h2>
    </GoalWrapper>
  );
};