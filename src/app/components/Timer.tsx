import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../StoreProvider';
import { millisToMinutes } from '../shared/timeConverter';
import { Clock } from './Clock';
import { PlayPauseIcon } from './Icons/PlayPauseIcon';
import { IconButton as Button } from './UI/OptionsButton';
import styled from '@emotion/styled';
import { VscClose } from 'react-icons/vsc';
import { motion } from 'framer-motion';

export const Timer: React.FC = () => {
  const { dispatch, state: { timerDuration, timerAction, settings } } = useStore();
  const [time, setTime] = useState<number>(0);
  const timer = useRef<NodeJS.Timeout>(null);

  const handlePause = useCallback(() => {
    dispatch({ type: 'timer:pause', timerDuration: time });
  }, [dispatch, time]);

  const handleStart = useCallback(() => {
    dispatch({ type: 'timer:start', timerDuration: time ? time : settings?.duration });
  }, [dispatch, time, settings]);

  const handleClear = useCallback(() => {
    dispatch({ type: 'timer:complete', timerDuration: 0 });
  }, []);

  const handleComplete = useCallback(() => {
    dispatch({ type: 'timer:complete', timerDuration: 0 });
  }, [dispatch]);

  const countdown = useCallback((time: number) => {
    if (time <= 0) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      handleComplete();
      return 0;
    }
    return time - 1000;
  }, [handleComplete]);

  useEffect(() => {
    switch (timerAction) {
      case 'start':
        setTime(timerDuration || 0);
        if (timer.current) {
          clearInterval(timer.current);
        }
        setTime(time => time && time);
        timer.current = setInterval(() => {
          setTime(countdown); 
        }, 1000);
        break;
      case 'pause':
        setTime(timerDuration || 0);
        if (timer.current) {
          clearInterval(timer.current);
        }
        break;
      case 'complete':
        setTime(0);
        if (timer.current) {
          clearInterval(timer.current);
        }
        break;
    }
  }, [timerDuration, timerAction]);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }}>
      <IconButton 
        onClick={timerAction === 'start' ? handlePause : handleStart}
      >
        <PlayPauseIcon icon={timerAction ===  'start' ? 'play' : 'pause'}/>
      </IconButton>
      <Clock 
        percentage={timerDuration ? time * 100 / (settings?.duration || timerDuration) : 0}
        time={millisToMinutes(time)}
      />
      <IconButton 
        className="secondary"
        onClick={handleClear} 
        initial={false} 
        animate={{
          opacity: time > 0 ? 1 : 0,
          pointerEvents: time > 0 ? 'auto' : 'none',
        }}>
        <VscClose />
      </IconButton>
    </div>
  );
};

const IconButton = styled(motion.custom(Button))`
  margin-top: 28px;
  padding: 10px;
  width: 35px;
  height: 35px;
  svg {
    width: 30px;
    height: 30px;
  }
`;