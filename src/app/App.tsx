import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { BsCardChecklist } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { VscEye, VscTools } from 'react-icons/vsc';
import { Connector } from './components/Connector';
import { Goals } from './components/Goals';
import { Overview } from './components/Overview';
import { Timer } from './components/Timer';
import { Button } from './components/UI/Button';
import { Mobs } from './components/Mobs';
import { Tabs } from './components/UI/Tabs';
import { Store } from './shared/eventTypes';
import { useStore } from './StoreProvider';

const DashbordView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  height: 95vh;
  overflow-x: hidden;
  :nth-child(1) {
    overflow-y: auto;
  }
`;

const tabs = [
  {
    icon: VscEye,
    label: 'Overview'
  },
  {
    icon: FiUsers,
    label: 'Mob'
  },
  {
    icon: BsCardChecklist,
    label: 'Goals'
  },
  {
    icon: VscTools,
    label: 'Settings'
  }
];

export const App: React.FC = () => {
  const { dispatch, state: { 
      activeTabIndex, 
      timerName, 
      mob,
      settings,
   } } = useStore();

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
  }, [dispatch]);

  const handleActiveIndex = useCallback((index: number) => {
    dispatch({
      type: 'ACTIVE_TAB',
      index
    });
  }, [dispatch]);

  const handleMobUpdate = useCallback((mob: Store['mob']) => {
    dispatch({
      type: 'mob:update',
      mob
    });
  }, []);

  return !timerName ? (
    <Connector />
  ) : (
    <DashbordView>
      <div>
        <Timer />
        <Tabs
          tabs={tabs}
          activeIndex={activeTabIndex || 0}
          setActiveIndex={handleActiveIndex}
        >
          <Overview />
          <Mobs />
          <Goals />
        </Tabs>
      </div>
      <Button
        onClick={handleDisconnection}
      >
        Disconnect
      </Button>  
    </DashbordView>
  );
};