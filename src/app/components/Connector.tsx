import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { useStore } from '../StoreProvider';
import { parseMobTimeName } from '../utils/timerNameParser';
import { Button as ButtonUI } from './UI/Button';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { AnimatePresence, motion } from 'framer-motion';

const Button = motion.custom(ButtonUI);

export const Connector: React.FC = () => {
  const { dispatch } = useStore();
  const [timerName, setTimerName] = useState<string | undefined>(undefined);
  const [timerServer, setTimerServer] = useState<string | undefined>(undefined);

  const handleInputBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const { name, server } = parseMobTimeName(value);
    setTimerName(name);
    setTimerServer(server);
  };

  const handleConnection = useCallback(() => {
    if (timerName) {
      dispatch({ type: 'CONNECT', name: timerName, server: timerServer });
    }
  }, [dispatch, timerName, timerServer]);

  return (
    <>
      <input
        placeholder="Enter MobTime Name / url"
        onChange={handleInputBlur}
      />
      <p style={{ marginTop: '4px' }}>
        <strong>Server: </strong>
        <a href={`${timerServer || 'https://mobti.me'}/${timerName || ''}`}>
          {timerServer || 'https://mobti.me'}/{timerName}
        </a>
      </p>
      <AnimatePresence>
        {timerName && (
          <Button
            onClick={handleConnection}
            initial={{
              y: 50,
              opacity: 0
            }}
            animate={{
              y: 0,
              opacity: 1
            }}
            exit={{
              y: 50,
              opacity: 0
            }}
            transition={{
              type: 'spring',
              duration: 0.4,
            }}
          >
            <VscDebugDisconnect size={20}/> 
            <p>Connect</p>
          </Button>
        )}
      </AnimatePresence>
    </>
  );
};