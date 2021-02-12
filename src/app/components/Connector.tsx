import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { useStore } from '../StoreProvider';
import { parseMobTimeName } from '../utils/timerNameParser';
import { Button } from './UI/Button';
import { VscDebugDisconnect } from 'react-icons/vsc';

export const Connector: React.FC = () => {
  const { dispatch } = useStore();
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

  return (
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
          <VscDebugDisconnect size={20}/> 
          <p>Connect - {timerName}</p>
        </Button>
      )}
    </>
  );
};