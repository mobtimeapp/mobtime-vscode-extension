import React, { ChangeEventHandler, useState } from 'react';
import { parseMobTimeName } from './utils/timerNameParser';

export const App: React.FC = () => {
  const [timerName, setTimerName] = useState<string | undefined>(undefined);

  const handleInputBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setTimerName(parseMobTimeName(value));
  };

  return (
    <>
      <input
        placeholder="Enter MobTime Name / url"
        onChange={handleInputBlur}
      />
      {timerName && (
        <button
          disabled={!timerName}
        >
          Connect - {timerName}
        </button>
      )}
    </>
  );
};