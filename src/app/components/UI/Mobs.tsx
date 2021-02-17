import React, { useCallback } from 'react';
import { Store } from '../../shared/eventTypes';
import { MobName } from './MobName';
import { VscRefresh } from "react-icons/vsc";
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NewMob } from './NewMob';
import { shuffleArray } from '../../utils/arraySort';

import { Button } from './Button';
import { RandomIcon } from '../Icons/RandomIcon';
import { useStore } from '../../StoreProvider';
import { Sortables } from './Sortables';

export const Mobs: React.FC = () => {
  const { state: { mob, settings }, dispatch } = useStore();
  const handleMobsUpdate = useCallback((mob: Store['mob']) => {
    dispatch({
      type: 'mob:update',
      mob
    });
  }, [dispatch]);

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

  const handleNewMob = useCallback((newMob: Store['mob'][number]) => {
    handleMobsUpdate([
      ...mob,
      newMob
    ]);
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
      <NewMob onMobAdd={handleNewMob} />
    </div>
  );
};

const ActionsButtons = styled.div`
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