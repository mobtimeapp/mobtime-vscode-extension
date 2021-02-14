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
            <p>Connect - {timerName}</p>
          </Button>
        )}
      </AnimatePresence>
    </>
  );
};