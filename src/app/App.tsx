import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Button } from './components/UI/Button';
import { useStore } from './StoreProvider';
import { parseMobTimeName } from './utils/timerNameParser';

export const App: React.FC = () => {
  const { state, dispatch } = useStore();
  const [timerName, setTimerName] = useState<string | undefined>(undefined);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  const handleInputBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setTimerName(parseMobTimeName(value));
  };

  const handleConnection = useCallback(() => {
    if (timerName) {
      dispatch({ type: 'SET_NAME', name: timerName });
    }
  }, [dispatch, timerName]);

  const handleDisconnection = useCallback(() => {
    dispatch({ type: 'SET_NAME', name: undefined });
    socket.close();
  }, [dispatch, timerName]);

  useEffect(() => {
    if (state.timerName) {
      const socket = new WebSocket(`wss://mobtime.vehikl.com/${timerName}`);
      setSocket(socket);
      return;
    }
    setSocket(undefined);
  }, [state?.timerName]);

  useEffect(() => {
    if (socket) {
      // Connection opened
      socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({ type: 'client:new' }));
        console.log('connected');
      });

      // Listen for messages
      socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
      });
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

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
    <Button
      onClick={handleDisconnection}
    >
      Disconnect
    </Button>  
  </div>);
};