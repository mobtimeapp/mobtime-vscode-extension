import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Button } from './components/UI/Button';
import { parseMobTimeName } from './utils/timerNameParser';

export const App: React.FC = () => {
  const [timerName, setTimerName] = useState<string | undefined>(undefined);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  const handleInputBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setTimerName(parseMobTimeName(value));
  };

  const handleConnection = useCallback(() => {
    const socket = new WebSocket(`wss://mobtime.vehikl.com/${timerName}`);
    setSocket(socket);
  }, [timerName]);

  useEffect(() => {
    if (socket) {
      // Connection opened
      socket.addEventListener('open', function (event) {
        // socket.send('Hello Server!');
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
  ) : (<div>Connected</div>);
};