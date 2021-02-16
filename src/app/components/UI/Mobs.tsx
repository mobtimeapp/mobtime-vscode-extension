import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Store } from '../../shared/eventTypes';
import { MobName } from './MobName';
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
import { VscChevronDown, VscChevronUp, VscEdit, VscMenu, VscRefresh, VscTrash } from "react-icons/vsc";
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NewMob } from './NewMob';
import { OptionsButton } from './OptionsButton';
import { shuffleArray } from '../../utils/arraySort';

import { Button } from './Button';
import { RandomIcon } from '../Icons/RandomIcon';

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

const MotionButton = styled(motion.custom(Button))`
  p {
    margin-left: 8px;
  }
  div {
    width: 20px;
    height: 20px;
  }
  svg {
    margin-right: 0px;
    width: 20px;
    height: 20px;
  }
`;

const ActionsButtons = styled.div`
  display: flex;
  padding-left: 5px;
  button {
    margin-right: 5px;
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

  const handleRotate = useCallback(() => {
    setDraggedMobs(([firstMob, ...otherMobs]) => {
      const newMobs = [...otherMobs, firstMob];
      onUpdateMobs(newMobs);
      return newMobs;
    });
  }, [onUpdateMobs]);

  const handleSuffle = useCallback(() => {
    setDraggedMobs((mobs) => {
      const newMobs = shuffleArray(mobs);
      onUpdateMobs(newMobs);
      return newMobs;
    });
  }, [onUpdateMobs]);

  return (
    <div style={{ marginTop: '10px' }}>
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
      <ActionsButtons>
        <MotionButton
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap="tapped"
          onClick={handleRotate}
        >
          <motion.div 
            variants={{
              rest: {
                rotateZ: 0,
              },
              hover: {
                rotateZ: 180,
              },
              tapped: {
                rotateZ: 360,
              }
            }}
            transition={{
              type: 'spring',
              duration: 0.5
            }}
          >
            <VscRefresh />
          </motion.div>
          <p>
            Rotate
          </p>
        </MotionButton>
        <MotionButton
          className="secondary"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap="tapped"
          onClick={handleSuffle}
        >
          <RandomIcon />
          <p>
            Random
          </p>
        </MotionButton>
      </ActionsButtons>
      <NewMob onMobAdd={handleNewMob} />
    </div>
  );
};
