import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Store } from '../../shared/eventTypes';
import { MobName } from './MobName';
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
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
  const [draggedMobs, setDraggedMobs] = useState(mobs);

  const mappedMobs = useMemo(() => {
    const orders = order.split(',');
    return [...Array(Math.max(orders.length, draggedMobs.length))].map((_, i) => ({
      id: draggedMobs[i]?.id || i,
      name: draggedMobs[i]?.name,
      type: orders[i]
    }));
  }
  ,[order, draggedMobs]);

  const handleDragUpdate = (result: DragUpdate) => {
    if (
      result.source
      && result.destination
    ) {
      const newMobs = [...mobs];
      const source = {...mobs[result.source.index]};
      const destination ={...mobs[result.destination.index]};
      newMobs[result.source.index] = destination;
      newMobs[result.destination.index] = source;
      setDraggedMobs(newMobs);
    }
  };

  const handleDrag = useCallback((result: DropResult) => {
    if (
      result.source
      && result.destination
      && result.source.index !== result.destination.index
    ) {
      onUpdateMobs(draggedMobs);
    }
  }, [onUpdateMobs, draggedMobs]);

  return (
    <DragDropContext onDragEnd={handleDrag} onDragUpdate={handleDragUpdate}>
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