import React, { useCallback, useMemo } from 'react';
import { Store } from '../../shared/eventTypes';
import { MobName } from './MobName';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { VscThreeBars } from "react-icons/vsc";
import styled from '@emotion/styled';

interface MobsProps {
  mobs: Store['mob'];
  onUpdateMobs?: (newMobs: Store['mob']) => void;
  order: string;
}

const MobNameWrapper = styled.div`
  display: flex;
  align-items: center;
  h1 {
    margin-bottom: 0px !important;
  }
  margin-bottom: 24px;
  svg {
    margin-right: 10px;
    opacity: 0.5;
    :hover {
      opacity: 1;
    }
    * {
      stroke: var(--vscode-foreground)
    }
  }
`;

export const Mobs: React.FC<MobsProps> = ({ mobs, order, onUpdateMobs }) => {
  const mappedMobs = useMemo(() => {
    const orders = order.split(',');
    return [...Array(Math.max(orders.length, mobs.length))].map((_, i) => ({
      id: mobs[i]?.id || i,
      name: mobs[i]?.name,
      type: orders[i]
    }));
  }
  ,[order, mobs]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const newMobs = [...mobs];
    const source = mobs[result.source.index];
    const destination = mobs[result.destination.index];
    newMobs[result.source.index] = destination;
    newMobs[result.destination.index] = source;
    onUpdateMobs(newMobs);
  }, [onUpdateMobs, mobs]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="mobs">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {mappedMobs.map((mob, i) => (
              <Draggable key={mob.id} draggableId={mob.id.toString()} index={i}>
                {(provided) => (
                  <MobNameWrapper 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div {...provided.dragHandleProps}>
                      <VscThreeBars size={30}/>
                    </div>
                    <MobName name={mob.name} key={mob.id} type={mob.type}/>
                  </MobNameWrapper>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}