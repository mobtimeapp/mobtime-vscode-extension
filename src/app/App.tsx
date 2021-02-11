import React, { useCallback } from 'react';
import { Connector } from './components/Connector';
import { Timer } from './components/Timer';
import { Button } from './components/UI/Button';
import { useStore } from './StoreProvider';

export const App: React.FC = () => {
  const { state, dispatch, socket } = useStore();

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
  }, [dispatch]);

  return !socket ? (
    <Connector />
  ) : (<div>
    Connected
    <Timer />
    {JSON.stringify(state)}
    <Button
      onClick={handleDisconnection}
    >
      Disconnect
    </Button>  
  </div>);
};