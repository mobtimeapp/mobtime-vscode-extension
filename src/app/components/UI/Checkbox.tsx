import React, { memo, useCallback } from "react";
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
} 

export const Checkbox: React.FC<CheckboxProps> = memo(({ checked, onChange }) => {
  const varient = useMemo(() => checked ? 'ck' : 'notCk', [checked]);
  const onClick = useCallback(() => onChange(!checked), [onChange, checked]);

  return (
    <div 
      onClick={onClick}
    >
      <svg 
        width={25}
        height={25}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20"
        cursor="pointer"
      >
        <motion.circle
          cx={10}
          cy={10}
          r={8}
          stroke="var(--vscode-foreground)"
          strokeLinecap="round"
          strokeWidth={2}
          fill="none"
          variants={{
            ck: {
              strokeDasharray: 40
            },
            notCk: {
              strokeDasharray: 50
            }
          }}
          initial={false}
          animate={varient}
        />
        <motion.path 
          stroke="var(--vscode-terminal-ansiBrightGreen)"
          strokeWidth={2}
          fill="none"
          variants={{
            ck: {
              d: 
              [
                "M 5,10 5,10 5,10",
                "M 5,10 9,13 9,13",
                "M 5,10 9,13 18,2",
              ],
              opacity: 
              [
                0,
                1,
                1,
              ],
            },
            notCk: {
              d: 
              [
                "M 5,10 9,13 18,2",
                "M 5,10 9,13 9,13",
                "M 5,10 5,10 5,10",
                "M 5,10 5,10 5,10",
              ],
              opacity: 
              [
                1,
                1,
                1,
                0
              ],
            }
          }}
          strokeLinecap="round"
          initial={false}
          animate={varient}
          transition={{
            type: 'spring',
            duration: 0.2
          }}
        />
      </svg>
    </div>
  );
});
