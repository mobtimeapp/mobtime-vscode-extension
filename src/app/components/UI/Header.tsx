import styled from '@emotion/styled';
import React, { useCallback } from 'react';
import { Button } from './Button';
import { VscSyncIgnored, VscZoomIn, VscZoomOut } from "react-icons/vsc";
import { useDispatch, useStore } from '../../MobtimeProvider';
import { ExtensionAction } from '../../shared/actions';

export const Header: React.FC = () => {
  const { extensionStore: { timerName, viewZoom } } = useStore();
  const dispatch = useDispatch();

  const handleZoom = useCallback((zoom: number) => {
    dispatch({
      type: ExtensionAction.UPDATE_EXTENSION_STORE,
      data: { viewZoom: (viewZoom || 100) + zoom }
    });
  }, [dispatch, viewZoom]);

  const handleDisconnection = useCallback(() => {
    dispatch({ type: ExtensionAction.DISCONNECT_MOBTIME });
  }, [dispatch]);

  return (
    <HeaderWrapper>
      <TimerNameWrapper>
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
      </TimerNameWrapper>
      <DisconnectButton
        onClick={handleDisconnection}
      >
        <VscSyncIgnored />
        Disconnect
      </DisconnectButton>
    </HeaderWrapper>
  );
};

const TimerNameWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  p {
    opacity: 0;
  }
  > * {
    opacity: 0.3;
    transition: opacity 0.4s ease-in-out;
  }
  :hover {
    > * {
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

const DisconnectButton = styled(Button)`
  width: max-content;
  margin-top: 0px;
  padding-left: 10px;
  padding-right: 10px;
`;