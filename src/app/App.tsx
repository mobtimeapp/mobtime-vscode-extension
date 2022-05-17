import styled from '@emotion/styled';
import React, { useCallback, useMemo } from 'react';
import { BsCardChecklist } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { VscEye, VscTools } from 'react-icons/vsc';
import { Goals } from './components/Goals';
import { Overview } from './components/Overview';
import { Timer } from './components/Timer';
import { Mobs } from './components/Mobs';
import { Tabs } from './components/UI/Tabs';
import { useDispatch, useStore } from './MobtimeProvider';
import { Settings } from './components/Settings';
import { Header } from './components/UI/Header';
import { ExtensionAction } from './shared/actions';

export const App: React.FC = () => {
  const { 
    state: { 
      mob,
      goals
   }, 
   extensionStore: { 
     activeTabIndex,
    } 
  } = useStore();

  const dispatch = useDispatch();

  const handleActiveIndex = useCallback((index: number) => {
    dispatch({
      type: ExtensionAction.UPDATE_EXTENSION_STORE,
      data: { activeTabIndex: index }
    });
  }, [dispatch]);

  const goalsTooltip = useMemo(() => 
    `${
      goals?.filter(g => g.completed).length || 0
    } / ${goals?.length || 0}`
  , [goals]);

  const tabs = useMemo(() => [
    {
      icon: VscEye,
      label: 'Overview'
    },
    {
      icon: FiUsers,
      label: 'Mob',
      tooltip: (mob?.length || 0).toString(),
    },
    {
      icon: BsCardChecklist,
      label: 'Goals',
      tooltip: goalsTooltip,
    },
    {
      icon: VscTools,
      label: 'Settings'
    }
  ], [mob?.length, goalsTooltip]);

  return (<DashboardView>
      <div>
        <Header />
        <Timer />
        <Tabs
          tabs={tabs}
          activeIndex={activeTabIndex || 0}
          setActiveIndex={handleActiveIndex}
        >
          <Overview />
          <Mobs />
          <Goals />
          <Settings />
        </Tabs>
      </div>
    </DashboardView>
  );
};

const DashboardView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  min-height: calc(100vh - 32px);
  padding-left: 2px;
  padding-right: 2px;
  overflow-x: hidden;
`;