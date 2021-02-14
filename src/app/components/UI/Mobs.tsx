import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Store } from '../../shared/eventTypes';
import { MobName } from './MobName';
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
import { VscChevronDown, VscChevronUp, VscEdit, VscMenu, VscTrash } from "react-icons/vsc";
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NewMob } from './NewMob';
import { OptionsButton } from './OptionsButton';

interface MobsProps {
  mobs: Store['mob'];
  onUpdateMobs?: (newMobs: Store['mob']) => void;
  order: string;
}

const MobNameWrapper = styled.div`
  display: flex;
  width: '100%';
  align-items: center;
  h1 {
    margin-bottom: 0px !important;
  }
  margin-bottom: 24px;
  .dragIcon {
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
  useEffect(() => {
    setDraggedMobs(mobs);
  }, [mobs]);

  const mappedMobs = useMemo(() => {
    const orders = order.split(',');
    return [...Array(Math.max(orders.length, draggedMobs.length))].map((_, i) => ({
      id: (draggedMobs[i]?.id || i).toString(),
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
      const items = Array.from(mobs);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setDraggedMobs(items);
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

  const handleNewMob = useCallback((mob: Store['mob'][number]) => {
    setDraggedMobs(mobs => {
      const newMob = [
        ...mobs,
        mob
      ];
      onUpdateMobs(newMob);
      return newMob;
    });
  }, [onUpdateMobs]);

  const handleDelete = useCallback((mobId: string) => {
    setDraggedMobs(mobs => {
      const newMob = mobs.filter(({ id }) => id !== mobId);
      onUpdateMobs(newMob);
      return newMob;
    });
  }, [onUpdateMobs]);

  return (
    <div>
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
                      <motion.div
                        initial={{ scaleX: 0.75 }}
                        whileTap={{ scaleY: 0.5 }}
                      >
                        <div {...provided.dragHandleProps}>
                          <VscMenu
                            className="dragIcon"
                            size={30}
                          />
                        </div>
                      </motion.div>
                      <MobName 
                        name={mob.name} 
                        key={mob.id} 
                        index={i}
                        type={mob.type}
                      />
                      {mob.name && (
                        <OptionsButton
                          options={[
                            {
                              icon: VscChevronUp,
                              onClick: () => {},
                              hidden: i === 0
                            },
                            {
                              icon: VscChevronDown,
                              onClick: () => {},
                              hidden: (i + 1) === mappedMobs.length
                            },
                            {
                              icon: VscEdit,
                              onClick: () => {},
                            },
                            {
                              icon: VscTrash,
                              onClick: () => handleDelete(mob.id),
                              color: 'var(--vscode-charts-red)'
                            },
                          ]}
                        />
                      )}
                    </MobNameWrapper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <NewMob onMobAdd={handleNewMob} />
    </div>
  );
}