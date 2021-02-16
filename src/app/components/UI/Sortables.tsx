import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
import { VscChevronDown, VscChevronUp, VscEdit, VscMenu, VscTrash } from "react-icons/vsc";
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { OptionsButton } from './OptionsButton';


interface SortablesProps<A extends unknown> {
  items: A[];
  disableDrag?: boolean;
  onItemsUpdate?: (newMobs: A[]) => void;
  children: (item: A) => React.ReactChild
}

const MobNameWrapper = styled.div`
  display: flex;
  width: '100%';
  align-items: flex-start;
  position: relative;
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

export const Sortables = <A extends { id: string, hideOption?: boolean }>({ items, onItemsUpdate, children, disableDrag }: SortablesProps<A>) => {
  const [draggedItems, setDraggedItems] = useState(items);
  useEffect(() => {
    setDraggedItems(items);
  }, [items]);

  const handleDragUpdate = (result: DragUpdate) => {
    if (
      result.source
      && result.destination
    ) {
      const cloneditems = Array.from(items);
      const [reorderedItem] = cloneditems.splice(result.source.index, 1);
      cloneditems.splice(result.destination.index, 0, reorderedItem);
      setDraggedItems(cloneditems);
    }
  };

  const handleDrag = useCallback((result: DropResult) => {
    if (
      result.source
      && result.destination
      && result.source.index !== result.destination.index
    ) {
      onItemsUpdate(draggedItems);
    }
  }, [onItemsUpdate, draggedItems]);

  const handleDelete = useCallback((mobId: string) => {
    setDraggedItems(mobs => {
      const newItems = mobs.filter(({ id }) => id !== mobId);
      onItemsUpdate(newItems);
      return newItems;
    });
  }, [onItemsUpdate]);

  return (
    <DragDropContext onDragEnd={handleDrag} onDragUpdate={handleDragUpdate}>
      <Droppable droppableId="items">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {draggedItems.map((item, i) => (
              <Draggable key={item.id} draggableId={item.id.toString()} index={i}>
                {(provided) => (
                  <MobNameWrapper 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <motion.div
                      initial={{ scaleX: 0.75 }}
                      whileTap={{ scaleY: 0.5 }}
                      style={{
                        pointerEvents: disableDrag ? 'none' : 'auto'
                      }}
                    >
                      <div {...provided.dragHandleProps}>
                        <VscMenu
                          className="dragIcon"
                          size={30}
                        />
                      </div>
                    </motion.div>
                    <div style={{ width: '100%', marginRight: '35px' }}>
                      {children(item)}
                    </div>
                    {!item.hideOption && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'var(--vscode-sideBar-background)'
                        }}
                      >
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
                              hidden: (i + 1) === draggedItems.length || draggedItems.length < 2
                            },
                            {
                              icon: VscEdit,
                              onClick: () => {},
                            },
                            {
                              icon: VscTrash,
                              onClick: () => handleDelete(item.id),
                              color: 'var(--vscode-charts-red)'
                            },
                          ]}
                        />
                      </div>
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
  );
};
