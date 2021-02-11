import React, { createContext, Dispatch, Reducer, useContext, useEffect, useMemo, useReducer } from "react";
interface Store {
  timerName?: string;
}

type Actions = {
  type: 'SET_NAME',
  name: string
};

type VSCodeAPI = <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

declare var acquireVsCodeApi: VSCodeAPI;

const StoreContext = createContext({} as {
  state: Store,
  dispatch: Dispatch<Actions>,
  vscodeApi: ReturnType<VSCodeAPI>
});

const reduce: Reducer<Store, Actions> = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return {...state, timerName: action.name };
  }
};

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC = ({ children }) => {
  const vscodeApi = useMemo(() => acquireVsCodeApi(), []);
  const [state, dispatch] = useReducer(reduce, (vscodeApi.getState() || {}) as Store);

  useEffect(() => {
    vscodeApi.setState(state);
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch, vscodeApi }}>
      {children}
    </StoreContext.Provider>
  );
};