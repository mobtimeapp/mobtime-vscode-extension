import { motion } from 'framer-motion';
import React from 'react';

const defaultProps = {
  stroke: "var(--vscode-foreground) !important",
  strokeWidth: 2,
  strokeLinecap: "round",
} as const;

export const OptionIcon: React.FC = () => {
  return (
    <svg 
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 20 20"
      width="25px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.line
        variants={{
          open: {
            x1: 3,
            x2: 17,
            y1: 3,
            y2: 17,
          },
          close: {
            x1: 10,
            x2: 10,
            y1: 5,
            y2: 5,
          }
        }}
        {...defaultProps}
      />
      <motion.line 
        x1={10}
        x2={10}
        y1={10}
        y2={10}
        {...defaultProps}
      />
      <motion.line 
        variants={{
          open: {
            x1: 17,
            x2: 3,
            y1: 3,
            y2: 17,
          },
          close: {
            x1: 10,
            x2: 10,
            y1: 15,
            y2: 15,
          }
        }}
        {...defaultProps}
      />
    </svg>
  );
};