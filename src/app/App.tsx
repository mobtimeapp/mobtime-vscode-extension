import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Button } from './components/UI/Button';
import { useStore } from './StoreProvider';
import { parseMobTimeName } from './utils/timerNameParser';

export const App: React.FC = () => {
  const { state, dispatch, socket } = useStore();
  const [timerName, setTimerName] = useState<string | undefined>(undefined);

  const handleInputBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setTimerName(parseMobTimeName(value));
  };

  const handleConnection = useCallback(() => {
    if (timerName) {
      dispatch({ type: 'CONNECT', name: timerName });
    }
  }, [dispatch, timerName]);

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'DISCONNECT' });
    setTimerName('');
  }, [dispatch, timerName]);

  return !socket ? (
    <>
      <input
        placeholder="Enter MobTime Name / url"
        onChange={handleInputBlur}
      />
      {timerName && (
        <Button
          disabled={!timerName}
          onClick={handleConnection}
        >
          Connect - {timerName}
        </Button>
      )}
    </>
  ) : (<div>
    Connected
    {JSON.stringify(state)}
    <Button
      onClick={handleDisconnection}
    >
      Disconnect
    </Button>  
  </div>);
};