import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { Connector } from './components/Connector';
import { Overview } from './components/Overview';
import { Timer } from './components/Timer';
import { Button } from './components/UI/Button';
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

export const App: React.FC = () => {
  const { dispatch, socket } = useStore();

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
  }, [dispatch]);

  return !socket ? (
    <Connector />
  ) : (
    <DashbordView>
      <div>
        <Timer />
        <Overview />
      </div>
      <Button
        onClick={handleDisconnection}
      >
        Disconnect
      </Button>  
    </DashbordView>
  );
};