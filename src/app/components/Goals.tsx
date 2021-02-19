import styled from '@emotion/styled';
import React, { useCallback, useRef } from 'react';
import { VscAdd, VscTrash } from 'react-icons/vsc';
import Reward, { RewardElement } from 'react-rewards';
import { GoalType } from '../shared/eventTypes';
import { useStore } from '../StoreProvider';
import { Goal } from './Goal';
import { Button } from './UI/Button';
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
  const rewardRef = useRef<RewardElement>(null);

  const handleGoalsUpdate = useCallback((goals: GoalType[]) => {
    dispatch({
      type: 'goals:update',
      goals: goals
    });
  }, []);

  const handleNewGoal = useCallback((newItems: {
    id: string,
    text: string
  }[]) => {
    handleGoalsUpdate([
      ...goals,
      ...(newItems.map((item) => ({
          id: item.id,
          text: item.text,
          completed: false
        })))
    ]);
  }, [handleGoalsUpdate, goals]);

  const handleClearGoal = useCallback(() => {
    handleGoalsUpdate(goals.filter(g => !g.completed));
    rewardRef.current.rewardMe();
  }, [goals, handleGoalsUpdate]);

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
            isEditing={goal.isEditing}
            onEditDone={goal.onEditDone}
          />
        )}
      />
      <NewItem
        onItemAdd={handleNewGoal}
        placeholder="Add New Goal"
        addMultipleLabel="Add multiple goals"
        multipleItemPlaceholder={`Add New Goals\nOne goal per line\nAs many as you would like`}
        Icon={VscAdd}
        addMultiple={true}
      />
      <RewardWrapper>
        <Reward
          ref={(ref) => rewardRef.current = ref}
          type="confetti"
          config={{
            elementCount: 200,
            spread: 50,
            decay: 0.9,
            angle: 90,
            zIndex: 100,
          }}
        />
      </RewardWrapper>
      {goals.filter(g => g.completed).length > 0 && (
        <Button 
          className="secondary"
          onClick={handleClearGoal}
          style={{
            margin: 3
          }}
        >
          <VscTrash />
          Clear Completed Goals
        </Button>
      )}
    </div>
  );
};

const RewardWrapper = styled.div`
  display: flex;
  justify-content: center;
  span {
    position: fixed;
  }
`;