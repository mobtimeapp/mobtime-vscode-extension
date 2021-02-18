import { motion } from 'framer-motion';
import React from 'react';

const defaultProps = {
  fill: "var(--vscode-foreground) !important",
} as const;

interface PlayPauseIconProps {
  icon: 'play' | 'pause'
}

export const PlayPauseIcon: React.FC<PlayPauseIconProps> = ({ icon }) => {
  return (
    <motion.svg 
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 21 21"
      width="25px"
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={icon}
    >
      <motion.polygon
        variants={{
          play: {
            points: "0,0 7,0 7,21 0,21"
          },
          pause: {
            points: "0,0 10.5,7 10.5,14 0,21"
          }
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.3
        }}
        {...defaultProps}
      />
      <motion.polygon
        variants={{
          play: {
            points: "21,0 14,0 14,21 21,21"
          },
          pause: {
            points: "16.5,10.5 10.5,7 10.5,14 16.5,10.5"
          }
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.3
        }}
        {...defaultProps}
      />
    </motion.svg>
  );
};