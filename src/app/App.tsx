import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { BsCardChecklist } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { VscEye, VscTools } from 'react-icons/vsc';
import { Connector } from './components/Connector';
import { Overview } from './components/Overview';
import { Timer } from './components/Timer';
import { Button } from './components/UI/Button';
import { Tabs } from './components/UI/Tabs';
import { useStore } from './StoreProvider';

const DashbordView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  height: 95vh;
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
  const { dispatch, socket, state: { activeTabIndex } } = useStore();

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
  }, [dispatch]);

  const handleActiveIndex = useCallback((index: number) => {
    dispatch({
      type: 'ACTIVE_TAB',
      index
    });
  }, [dispatch]);

  return !socket ? (
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
          <div>
            <Overview />
          </div>
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