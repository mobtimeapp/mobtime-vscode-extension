import styled from '@emotion/styled';
import React from 'react';
import { IconType } from 'react-icons';

interface TabsProps {
  tabs: {
    label: string;
    icon: IconType;
  }[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const transition = `transform .3s cubic-bezier(0.63, 0.65, 0.32, 1.28)`;

const TabsContainer = styled.div`
  > div {
    display: grid;
    grid-template-columns: repeat(${p => parseInt(p['data-count'])}, 100%);
    grid-gap: 5px;
    transform: translateX(calc(-${p => parseInt(p['data-active-index']) * 100}% - ${p => parseInt(p['data-active-index']) * 5}px));
    transition: ${transition};
  }
  overflow-x: hidden;
`;

const TabsWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(${p => parseInt(p['data-count'])}, 1fr);
  [data-active="true"] {
    opacity: 1 !important
  }
`;

const Tab = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 40px auto;
  grid-gap: 3px;
  justify-items: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity .1s ease-in-out;
  svg {
    width: 20px;
    height: 20px;
  }
  p {
    font-size: 12px;
  }
`;

const TabHighlighter = styled.div`
  display: block;
  height: 2px;
  background-color: var(--vscode-button-hoverBackground);
  width: ${p => 100/parseInt(p['data-count'])}%;
  transform: translateX(${p => parseInt(p['data-active-index']) * 100}%);
  transition:  ${transition};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  children,
  setActiveIndex,
  activeIndex
}) => {
  return (
    <>
      <TabsWrapper data-count={tabs.length}>
        {tabs.map(({ label, icon: Icon }, index) => (
          <Tab
            onClick={() => setActiveIndex(index)}
            key={label}
            role="button"
            data-active={index === activeIndex}
          >
            <Icon />
            <p>{label}</p>
          </Tab>
        ))}
      </TabsWrapper>
      <TabHighlighter
        data-count={tabs.length} 
        data-active-index={activeIndex}
      />
      <TabsContainer
        data-count={tabs.length}
        data-active-index={activeIndex}
      >
        <div>
          {children}
        </div>
      </TabsContainer>
    </>
  );
}