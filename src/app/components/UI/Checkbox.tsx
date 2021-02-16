import React from "react";
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
} 

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  const varient = useMemo(() => checked ? 'checked' : 'notChecked', [checked]);
  
  return (
    <div 
      onClick={() => onChange && onChange(!checked)}
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
            checked: {
              strokeDasharray: 40
            },
            notChecked: {
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
            checked: {
              d: [
                "M 5,10 5,10 5,10",
                "M 5,10 9,13 9,13",
                "M 5,10 9,13 18,2",
              ],
              opacity: [
                0,
                1,
                1,
              ],
            },
            notChecked: {
              d: [
                "M 5,10 9,13 18,2",
                "M 5,10 9,13 9,13",
                "M 5,10 5,10 5,10",
                "M 5,10 5,10 5,10",
              ],
              opacity: [
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
};
