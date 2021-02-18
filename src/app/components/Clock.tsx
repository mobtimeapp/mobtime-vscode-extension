import styled from '@emotion/styled';
import React from 'react';

interface ClockProps {
  percentage: number;
  time: string;
}

export const Clock: React.FC<ClockProps> = ({ percentage, time }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          width: '200px',
          marginBottom: '-30px',
        }}
      >
        <svg width="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle
            cy={100}
            cx={100}
            r={80}
          />
          <Circle
            style={{
              strokeDashoffset: percentage ? (255 + ((percentage * 345) / 100)) : 255,
              stroke: 'var(--vscode-terminal-ansiBrightCyan)'
            }}
            cy={100}
            cx={100}
            r={80}
          />
        </svg>
      </div>
      <Time>
        {time}
      </Time>
    </div>
  );
};

const Circle = styled.circle`
  stroke-width: 60px;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 10px;
  stroke-dasharray: 600;
  stroke-dashoffset: 255;
  transform-origin: center;
  transform: rotate(145deg);
  stroke: var(--vscode-editorPane-background);
  transition: stroke-dashoffset 1s linear;
`;


const Time = styled.h1`
  font-size: 35px;
  margin-top: -100px;
  margin-bottom: 40px;
`;
