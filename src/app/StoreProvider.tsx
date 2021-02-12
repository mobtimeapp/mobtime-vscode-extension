import React, { createContext, Dispatch, Reducer, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { VSCodeAPI, Store, Actions } from './shared/eventTypes';

declare var acquireVsCodeApi: VSCodeAPI;

const StoreContext = createContext({} as {
  state: Store,
  dispatch: Dispatch<Actions>,
  vscodeApi: ReturnType<VSCodeAPI>,
});

const reduce: Reducer<Store, Actions> = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state, 
        timerName: action.name,
        socket: new WebSocket(`wss://mobtime.vehikl.com/${action.name}`),
      };
    case 'DISCONNECT':
      return { };
    case 'ACTIVE_TAB':
      return {
        ...state,
        activeTabIndex: action.index
      };
    case 'timer:pause':
      return {
        ...state,
        timerAction: 'pause',
        timerDuration: action.timerDuration
      };
    case 'timer:start':
      return {
        ...state,
        timerAction: 'start',
        timerDuration: action.timerDuration
      };
    case 'timer:complete':
      return {
        ...state,
        timerAction: 'complete',
        timerDuration: action.timerDuration
      };
    default: 
      const { type, ...data } = action;
      return {...state, ...data };
  }
};

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC = ({ children }) => {
  const vscodeApi = useMemo(() => acquireVsCodeApi(), []);
  const [state, dispatch] = useReducer(
    reduce,
    (vscodeApi.getState() || {}) as Store
  );

  useEffect(() => {
    const messageHandler = (e: MessageEvent<Actions>) => {
      dispatch(e.data);
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const userDispatcher = useCallback((action: Actions) => {
    dispatch(action);
    vscodeApi.postMessage(action);
  }, [dispatch, vscodeApi]);
  
  useEffect(() => {
    vscodeApi.setState(state);
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch: userDispatcher, vscodeApi }}>
      {children}
    </StoreContext.Provider>
  );
};