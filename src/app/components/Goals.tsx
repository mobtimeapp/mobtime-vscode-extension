import React, { useMemo } from 'react';
import { GoalType } from '../shared/eventTypes';
import { useStore } from '../StoreProvider';
import { Goal } from './Goal';
import { Sortables } from './UI/Sortables';

const placeholders = [
  'A good day would be...',
  'A grate day would be ...'
];

export const mapGoals = (goals: GoalType[]): (GoalType & { placholder?: string, hideOption?: boolean })[] => (
  [...Array(Math.max(goals.length, 2))].map((_, i) => ({
    ...goals[i],
    id: goals[i]?.id || `i_${i}`,
    placholder: placeholders[i],
    hideOption: !goals[i]?.text
  }))
);

export const Goals: React.FC = () => {
  const { state: { goals }, dispatch } = useStore();
  const mappedGoals = useMemo(() => mapGoals(goals), [goals]);
  return (
    <Sortables
      items={mappedGoals}
      disableDrag={goals.length < 2}
      onItemsUpdate={items => dispatch({
        type: 'goals:update',
        goals: items
          .filter(g => g.text)
          .map(({ placholder, hideOption, ...goal }) => goal)
      })}
      children={(goal) => (
        <Goal 
          placeholder={goal.placholder}
          completed={goal.completed}
          id={goal.id}
          text={goal.text}
        />
      )}
    />
  );
};