import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../StoreProvider';
import { millisToMinutes } from '../shared/timeConverter';
import { Clock } from './Clock';
import { Button } from './UI/Button';

export const Timer: React.FC = () => {
  const { dispatch, state: { timerDuration, timerAction, settings } } = useStore();
  const [time, setTime] = useState<number>(0);
  const timer = useRef<NodeJS.Timeout>(null);
  const countdown = useCallback((time: number) => {
    if (time <= 0) {
      return 0;
    }
    return time - 1000;
  }, []);

  useEffect(() => {
    switch (timerAction) {
      case 'start':
        setTime(timerDuration || 0);
        timer.current && clearInterval(timer.current);
        timer.current = setInterval(() => {
          setTime(countdown);
        }, 1000);
        break;
      case 'pause':
        setTime(timerDuration || 0);
        timer.current && clearInterval(timer.current);
        break;
      case 'complete':
        setTime(0);
        timer.current && clearInterval(timer.current);
        break;
    }
  }, [timerDuration, timerAction]);

  const handlePause = useCallback(() => {
    dispatch({ type: 'timer:pause', timerDuration: time });
  }, [dispatch, time]);

  const handleStart = useCallback(() => {
    dispatch({ type: 'timer:start', timerDuration: time ? time - 1000 : settings?.duration });
  }, [dispatch, time, settings]);

  const handleClear = useCallback(() => {
    dispatch({ type: 'timer:complete', timerDuration: 0 });
  }, [dispatch]);

  return (
    <>
      <Clock 
        percentage={timerDuration ? time * 100 / settings?.duration || timerDuration : 0}
        time={millisToMinutes(time)}
      />
      <div style={{ display: 'flex' }}>
        { timerAction !== 'start' && (
          <Button
            onClick={handleStart}
          >
            {timerAction === 'pause' ? 'Resume' : 'Start Turn'} 
          </Button>
        )}
        { timerAction === 'start' && (
          <Button
            onClick={handlePause}
          >
            Pause
          </Button>
        )}
        { time > 0 && (
          <Button
            className="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </div>
    </>
  );
};