import React, { createContext, Dispatch, Reducer, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
interface Store {
  socket?: WebSocket;
  timerName?: string;
  isOwner?: boolean;
  mob?: {
    id: string;
    name: string;
  }[];
  goals?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  settings?: {
    mobOrder: string,
    duration: number;
  },
  timerDuration?: number;
  timerAction?: 'start' | 'pause' | 'complete';
}

type CONNECT = {
  type: 'CONNECT',
  name: string
};

type DISCONNECT = {
  type: 'DISCONNECT'
};

type MOB_UPDATE = {
  type: 'mob:update',
  mob: Store['mob']
};

type GOALS_UPDATE = {
  type: 'goals:update',
  goals: Store['goals']
};

type SETTINGS_UPDATE = {
  type: 'settings:update',
  settings: Store['settings']
};

type TIMER_START = {
  type: 'timer:start',
  timerDuration: Store['timerDuration']
};

type TIMER_PAUSE = {
  type: 'timer:pause',
  timerDuration: Store['timerDuration']
};

type TIMER_COMPLETE = {
  type: 'timer:complete',
  timerDuration: 0
};

type Actions = CONNECT | DISCONNECT | MOB_UPDATE | GOALS_UPDATE | SETTINGS_UPDATE | TIMER_START | TIMER_PAUSE | TIMER_COMPLETE;

type VSCodeAPI = <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

declare var acquireVsCodeApi: VSCodeAPI;

const StoreContext = createContext({} as {
  state: Store,
  dispatch: Dispatch<Actions>,
  vscodeApi: ReturnType<VSCodeAPI>,
  socket?: WebSocket
});

const reduce: Reducer<Store, Actions> = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      if (state.socket) {
        state.socket.close();
      }
      return {
        ...state, 
        timerName: action.name,
        socket: new WebSocket(`wss://mobtime.vehikl.com/${action.name}`),
      };
    case 'DISCONNECT':
      if (state.socket) {
        state.socket.close();
      }
      return { };
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
  const [{ socket, ...state }, dispatch] = useReducer(
    reduce,
    (vscodeApi.getState() || {}) as Store
  );

  useEffect(() => {
    vscodeApi.setState(state);
  }, [state]);

  useEffect(() => {
    if (!socket && state.timerName) {
      dispatch({
        type: 'CONNECT',
        name: state.timerName
      });
    } 
  }, [socket && state.timerName, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ type: 'client:new' }));
      });

      socket.addEventListener('message', (event) => {
        dispatch(JSON.parse(event.data));
      });

      return () => {
        if (socket) {
          socket.close();
        }
      };
    } 
  }, [socket, dispatch]);

  const userDispatcher = useCallback((action: Actions) => {
    if (!['CONNECT', 'DISCONNECT'].includes(action.type) && socket) {
      socket.send(JSON.stringify(action));
    }
    dispatch(action);
  }, [dispatch, socket]);

  return (
    <StoreContext.Provider value={{ state, socket, dispatch: userDispatcher, vscodeApi }}>
      {children}
    </StoreContext.Provider>
  );
};