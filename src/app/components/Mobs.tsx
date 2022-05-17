import React, { useCallback } from 'react';
import { VscRefresh } from "react-icons/vsc";
import styled from '@emotion/styled';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Store } from '../shared/eventTypes';
import { motion } from 'framer-motion';
import { shuffleArray } from '../utils/arraySort';
import { RandomIcon } from './Icons/RandomIcon';
import { Sortables } from './UI/Sortables';
import { MobName } from './UI/MobName';
import { NewItem } from './UI/NewItem';
import { Button } from './UI/Button';
import { useDispatch, useStore } from '../MobtimeProvider';
import { ExtensionAction } from '../shared/actions';

export const Mobs: React.FC = () => {
  const dispatch = useDispatch();
  const { state: { mob, settings } } = useStore();
  const handleMobsUpdate = useCallback((mob: Store['mob']) => {
    dispatch({
      type: ExtensionAction.SET_MOB,
      mob,
    });
  }, []);

  const mapMobs = useCallback((mobs: Store['mob'] = []) => {
    const orders = settings?.mobOrder?.split(',') || [];
    return [...Array(Math.max(orders.length || 0, mobs?.length || 0))].map((_, i) => ({
      id: (mobs[i]?.id || i).toString(),
      name: mobs[i]?.name,
      type: orders[i],
      hideOption: !mobs[i]?.name
    }));
  }
  ,[settings?.mobOrder]);


  const handleRotate = useCallback(() => {
    const [firstMob, ...otherMobs] = mob;
    handleMobsUpdate([...otherMobs, firstMob]);
  }, [mob, handleMobsUpdate]);

  const handleSuffle = useCallback(() => {
    handleMobsUpdate(shuffleArray(mob));
  }, [handleMobsUpdate, mob]);

  const handleNewMob = useCallback((newItems: {
    id: string,
    text: string
  }[]) => {
    handleMobsUpdate([
      ...mob,
      ...(newItems.map((item) => ({
          id: item.id,
          name: item.text
        })))
    ]);
  }, [handleMobsUpdate, mob]);

  const handleEditMob = useCallback((id: string, name: string) => {
    handleMobsUpdate(mob.map(m => {
      if (m.id === id) {
        return {
          ...m,
          name
        };
      }
      return m;
    }));
  }, [handleMobsUpdate, mob]);

  return (
    <div style={{ marginTop: '10px' }}>
      <Sortables
        items={mob || []}
        disableDrag={(mob || [])?.length < 2}
        onItemsUpdate={handleMobsUpdate}
        mapItems={mapMobs}
        children={(mob, i) => (
          <MobName
            name={mob.name} 
            key={mob.id} 
            index={i}
            type={mob.type}
            isEditing={mob.isEditing}
            onEditDone={mob.onEditDone}
            onMobNameUpdate={(name) => handleEditMob(mob.id, name)}
          />
        )}
      />
      <ActionsButtons
        style={(mob || []).length < 2 ? {
          pointerEvents: 'none',
          opacity: 0.5
        } : {}}
      >
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
      <NewItem
        onItemAdd={handleNewMob}
        placeholder="Add new mob"
        Icon={AiOutlineUserAdd}
      />
    </div>
  );
};

export const ActionsButtons = styled.div`
  display: flex;
  padding-left: 5px;
  button {
    margin-right: 5px;
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