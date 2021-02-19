import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult } from 'react-beautiful-dnd';
import { VscChevronDown, VscChevronUp, VscEdit, VscMenu, VscTrash } from "react-icons/vsc";
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { OptionsButton } from './OptionsButton';

type SortablesComponent = <A extends { id: string }, MI extends A & { hideOption?: boolean }>(props: {
  items: A[];
  disableDrag?: boolean;
  onItemsUpdate?: (newItems: A[]) => void;
  mapItems: (items: A[]) => MI[];
  children: (item: MI & { onEditDone: () => void, isEditing: boolean }, index: number) => React.ReactChild;
}) => ReturnType<React.FC>;

export const Sortables: SortablesComponent = ({ items, onItemsUpdate, children, disableDrag, mapItems }) => {
  const [draggedItems, setDraggedItems] = useState(items);
  const [editingItems, setEditingItems] = useState<string[]>([]);

  const handleOnEdit = (id: string) => {
    setEditingItems(ids => [...ids, id]);
  };

  const handleOnEditDone = (id: string) => {
    setEditingItems(ids => ids.filter(eId => eId !== id));
  };

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

  const handleDelete = useCallback((itemId: string) => {
    setDraggedItems(items => {
      const newItems = items.filter(({ id }) => id !== itemId);
      onItemsUpdate(newItems);
      return newItems;
    });
  }, [onItemsUpdate]);

  const handleSwitch = useCallback((currentIndex: number, direction: 1 | -1) => {
    setDraggedItems(items => {
      const newItems = [...items];
      const currentItem = items[currentIndex];
      const switchItem = items[currentIndex + direction];
      newItems[currentIndex + direction] = currentItem;
      newItems[currentIndex] = switchItem;
      onItemsUpdate(newItems);
      return newItems;
    });
  }, [onItemsUpdate]);

  return (
    <DragDropContext onDragEnd={handleDrag} onDragUpdate={handleDragUpdate}>
      <Droppable droppableId="items">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <AnimatePresence>
            {
              mapItems(draggedItems)
              .map((item, i) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={i}>
                  {(provided) => (
                    <ItemWrapper 
                      ref={provided.innerRef}
                      exit={!item.hideOption ? {
                        opacity: 0,
                        x: 100
                      }: {}}
                      {...provided.draggableProps}
                      transition={{
                        type: 'spring',
                        duration: 0.5
                      }}
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
                        {children({
                          ...item,
                          isEditing: editingItems.includes(item.id),
                          onEditDone: () => handleOnEditDone(item.id)
                        }, i)}
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
                                onClick: () => handleSwitch(i, -1),
                                hidden: i === 0
                              },
                              {
                                icon: VscChevronDown,
                                onClick: () => handleSwitch(i, 1),
                                hidden: (i + 1) === draggedItems.length || draggedItems.length < 2
                              },
                              {
                                icon: VscEdit,
                                onClick: () => handleOnEdit(item.id),
                                closeOnlick: true
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
                    </ItemWrapper>
                  )}
                </Draggable>
            ))}
            {provided.placeholder}
            </AnimatePresence>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const ItemWrapper = styled(motion.div)`
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