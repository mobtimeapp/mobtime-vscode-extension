import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useLayoutEffect, useRef } from 'react';
import { IconType } from 'react-icons';

interface TabsProps {
  tabs: {
    label: string;
    icon: IconType;
    tooltip?: string;
  }[];
  activeIndex: number;
  children: React.ReactChild[];
  setActiveIndex: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> = memo(({
  tabs,
  children,
  setActiveIndex,
  activeIndex
}) => {
  const previousActiveIndex = useRef(activeIndex);
  useLayoutEffect(() => {
    previousActiveIndex.current = activeIndex;
  }, [activeIndex]);
  return (
    <>
      <TabsWrapper data-count={tabs.length}>
        {tabs.map(({ label, icon: Icon, tooltip }, index) => (
          <Tab
            onClick={() => setActiveIndex(index)}
            key={label}
            role="button"
            initial={{
              opacity: 0.5,
              y: 8,
            }}
            animate={{
              opacity: index === activeIndex ? 1 : 0.5,
              y: index === activeIndex ? 0 : 8,
            }}
            transition={{
              type: 'spring',
              duration: 0.4
            }}
          >
            {!!tooltip && (
              <TabTooltip>
                {tooltip}
              </TabTooltip>
            )}
            <Icon />
            <p>{label}</p>
          </Tab>
        ))}
      </TabsWrapper>
      <Highlighter
        initial={false}
        style={{
          width: `${100/tabs.length}%`
        }}
        animate={{
          marginLeft: `${((100/tabs.length) * activeIndex) + 100/(tabs.length * 2)}%`
        }}
        transition={{
          type: 'spring',
          duration: 0.4
        }}
      />
      <TabsContainer>
        <div>
          <AnimatePresence>
            {children.map((tabContent, index) => (
              activeIndex === index && (
                <motion.div
                  key={index} 
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                >
                  {tabContent}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </TabsContainer>
    </>
  );
});

const TabsContainer = styled.div`
  max-width: '100vw';
  overflow: 'hidden';
  > div {
    display: grid;
    > * {
      width: 100%;
      grid-column: 1;
      grid-row: 1;
    }
  }
`;

const TabsWrapper = styled.div`
  max-width: '100vw';
  display: flex;
`;

const Tab = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 40px auto;
  grid-gap: 0px;
  padding-left: 4px;
  padding-right: 4px;
  justify-items: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  opacity: 0.4;
  svg {
    width: 20px;
    height: 20px;
  }
  p {
    font-size: 12px;
  }
`;

const TabTooltip = styled.p`
  position: absolute;
  right: 4px;
  top: -3px;
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-right: 30px;
  font-size: 12px !important;
  padding: 2px 8px !important;
  border-radius: 18px !important;
`;

const Highlighter = styled(motion.div)`
  display: block;
  height: 3px;
  background-color: var(--vscode-button-hoverBackground);
  margin-top: 10px;
  margin-bottom: 10px;
  transform: translateX(-50%);
`;