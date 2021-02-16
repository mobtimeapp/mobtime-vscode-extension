import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { randomInteger } from '../../utils/randomNumber';

const restSort = [0, 1, 2, 3];
const hoverSort = [2, 1, 3, 0];
const tapSort = [3, 0, 1, 2];

export const RandomIcon: React.FC = () => {
  const lineLength = useMemo(() => [...Array(4)].map(() => randomInteger(12, 20)), []);
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20"
    >
      {restSort.map((pos,i) => (
        <React.Fragment
          key={i}
        >
          <motion.circle
            cx={2.5}
            cy={(5 * pos) + 2.5}
            variants={{
              rest: {
                cy: (5 * restSort[i]) + 2.5,
              },
              hover: {
                cy: (5 * hoverSort[i]) + 2.5,
              },
              tapped: {
                cy: (5 * tapSort[i]) + 2.5,
              }
            }}
            r={1.5}
            fill="var(--vscode-foreground)"
          />
          <motion.line
            x1={6.5}
            x2={lineLength[i]}
            variants={{
              rest: {
                y1: (5 * restSort[i]) + 2.5,
                y2: (5 * restSort[i]) + 2.5
              },
              hover: {
                y1: (5 * hoverSort[i]) + 2.5,
                y2: (5 * hoverSort[i]) + 2.5
              },
              tapped: {
                y1: (5 * tapSort[i]) + 2.5,
                y2: (5 * tapSort[i]) + 2.5
              }
            }}
            transition={{
              type: 'spring',
              duration: 0.5
            }}
            stroke="var(--vscode-foreground)"
            strokeWidth={1.5}
          />
        </React.Fragment>
      ))}
    </svg>
  );
};