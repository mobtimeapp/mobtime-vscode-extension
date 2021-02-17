import React, { useCallback } from 'react';
import { VscAdd } from 'react-icons/vsc';
import { GoalType } from '../shared/eventTypes';
import { useStore } from '../StoreProvider';
import { Goal } from './Goal';
import { NewItem } from './UI/NewItem';
import { Sortables } from './UI/Sortables';

const placeholders = [
  'A good day would be...',
  'A great day would be ...'
];

export const mapGoals = (goals: GoalType[] = []): (GoalType & { placholder?: string, hideOption?: boolean })[] => (
  [...Array(Math.max(goals.length, 2))].map((_, i) => ({
    ...goals[i],
    id: goals[i]?.id || `i_${i}`,
    placholder: placeholders[i],
    hideOption: !goals[i]?.text
  }))
);

export const Goals: React.FC = () => {
  const { state: { goals }, dispatch } = useStore();

  const handleGoalsUpdate = useCallback((goals: GoalType[]) => {
    dispatch({
      type: 'goals:update',
      goals: goals
    });
  }, []);

  const handleNewGoal = useCallback((newItem: {
    id: string,
    text: string
  }) => {
    handleGoalsUpdate([
      ...goals,
      {
        id: newItem.id,
        text: newItem.text,
        completed: false
      }
    ]);
  }, [handleGoalsUpdate, goals]);

  return (
    <div>
      <Sortables
        items={goals || []}
        disableDrag={goals?.length < 2}
        onItemsUpdate={handleGoalsUpdate}
        mapItems={mapGoals}
        children={(goal) => (
          <Goal 
            placeholder={goal?.placholder}
            completed={goal?.completed}
            id={goal?.id}
            text={goal?.text}
            key={goal?.id}
          />
        )}
      />
      <NewItem
        onItemAdd={handleNewGoal}
        placeholder="Add New Goal"
        Icon={VscAdd}
      />
    </div>
  );
};