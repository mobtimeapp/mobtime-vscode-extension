import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { useStore } from './../../StoreProvider';
import { Button } from './Button';
import { VscZoomIn, VscZoomOut } from "react-icons/vsc";

export const Header: React.FC = () => {
  const { state: { timerName, viewZoom }, dispatch } = useStore();
  const handleZoom = useCallback((zoom: number) => {
    dispatch({
      type:'VIEW_ZOOM',
      zoom: (viewZoom || 100) + zoom
    });
  }, [viewZoom]);

  return (
    <HeaderWrapper>
      <h3>
        <strong>
          {timerName}
        </strong>
      </h3>
      <ButtonsWrapper>
        <p>
          {viewZoom || 100}%
        </p>
        <IconButton
          className={!(viewZoom > 100) && "secondary"}
          onClick={() => handleZoom(5)}
        >
          <VscZoomIn />
        </IconButton>
        <IconButton
          className={!(viewZoom < 100) && "secondary"}
          onClick={() => handleZoom(-5)}
        >
          <VscZoomOut />
        </IconButton>
      </ButtonsWrapper>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3px;
`;

const ButtonsWrapper = styled(HeaderWrapper)`
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.4s ease-in-out;
  * {
    margin-right: 6px;
  }
  p {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;
  }
  :hover {
    opacity: 1;
    p {
      opacity: 1;
    }
  }
`;


const IconButton = styled(Button)`
  width: 24px;
  height: 24px;
  margin-top: 0px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 0px
  }
`;