import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { millisToMinutes } from '../shared/timeConverter';
import { Clock } from './Clock';
import { PlayPauseIcon } from './Icons/PlayPauseIcon';
import { IconButton as Button } from './UI/OptionsButton';
import styled from '@emotion/styled';
import { VscClose } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { useDispatch, useStore } from '../MobtimeProvider';
import { MobtimeState } from '../shared/interfaces';
import { ExtensionAction } from '../shared/actions';

export const Timer: React.FC = () => {
  const { state: { settings, timer } } = useStore();
  const [time, setTime] = useState<number>(0);
  const ticktok = useRef<NodeJS.Timeout>(null);
  const dispatch = useDispatch();
  const timePercentage = useMemo(() => 100 - (settings.duration ? time * 100 / (settings?.duration) : 0), [time, settings.duration]);

  const handlePause = useCallback(() => {
    dispatch({ type: ExtensionAction.PAUSE });
  }, [time]);

  const handleStart = useCallback(() => {
    dispatch({ type: ExtensionAction.START });
  }, [time, settings]);

  const handleClear = useCallback(() => {
    dispatch({ type: ExtensionAction.CLEAR });
  }, []);

  const updateTimer = useCallback((timer: MobtimeState['timer']) => {
    if (!timer.startedAt) {
      setTime(timer.duration);
      return;
    }

    const elapsedTime = Date.now() - (timer.startedAt || 0);
    const remainingTime = timer.duration - elapsedTime;
    
    if (remainingTime <= 0) {
      if (ticktok.current) {
        clearInterval(ticktok.current);
      }
      setTime(0);
      return;
    }

    setTime(remainingTime);
  }, [settings.duration]);

  useEffect(() => {
    if (ticktok.current) {
      clearInterval(ticktok.current);
    }

    updateTimer(timer);

    if (timer.startedAt) {
      ticktok.current = (setInterval(() => {
        updateTimer(timer);
      }, 100)) as unknown as NodeJS.Timeout;
    }

  }, [timer]);

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }}>
      <IconButton 
        onClick={timer.startedAt ? handlePause : handleStart}
      >
        <PlayPauseIcon 
          icon={timer.startedAt ? 'play' : 'pause'}
        />
      </IconButton>
      <Clock 
        percentage={timePercentage}
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