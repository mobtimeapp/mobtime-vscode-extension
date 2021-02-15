import { motion } from 'framer-motion';
import React from 'react';

export const OptionIcon: React.FC = () => {
  return (
    <svg 
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 20 20"
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
        stroke="var(--vscode-foreground)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <motion.line 
        x1={10}
        x2={10}
        y1={10}
        y2={10}
        stroke="var(--vscode-foreground)"
        strokeWidth={2}
        strokeLinecap="round"
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
        x1={10}
        x2={10}
        y1={15}
        y2={15}
        stroke="var(--vscode-foreground)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
    // <svg 
    //   xmlns="http://www.w3.org/2000/svg" 
    //   viewBox="0 0 20 20"
    // >
    //   {restSort.map((pos,i) => (
    //     <React.Fragment
    //       key={i}
    //     >
    //       <motion.circle
    //         cx={2.5}
    //         cy={(5 * pos) + 2.5}
    //         variants={{
    //           rest: {
    //             cy: (5 * restSort[i]) + 2.5,
    //           },
    //           hover: {
    //             cy: (5 * hoverSort[i]) + 2.5,
    //           },
    //           tapped: {
    //             cy: (5 * tapSort[i]) + 2.5,
    //           }
    //         }}
    //         r={1.5}
    //         fill="var(--vscode-foreground)"
    //       />
    //       <motion.line
    //         x1={6.5}
    //         x2={randomInteger(12, 20)}
    //         variants={{
    //           rest: {
    //             y1: (5 * restSort[i]) + 2.5,
    //             y2: (5 * restSort[i]) + 2.5
    //           },
    //           hover: {
    //             y1: (5 * hoverSort[i]) + 2.5,
    //             y2: (5 * hoverSort[i]) + 2.5
    //           },
    //           tapped: {
    //             y1: (5 * tapSort[i]) + 2.5,
    //             y2: (5 * tapSort[i]) + 2.5
    //           }
    //         }}
    //         transition={{
    //           type: 'spring',
    //           duration: 0.5
    //         }}
    //         stroke="var(--vscode-foreground)"
    //         strokeWidth={1.5}
    //       />
    //     </React.Fragment>
    //   ))}
    // </svg>
  );
};