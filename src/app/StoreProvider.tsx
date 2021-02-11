import { createContext, Dispatch, Reducer, useReducer } from "react";

interface Store {
  timerName?: string;
}

const initialStore: Store = {
  timerName: undefined
};

type Actions = {
  type: 'SET_NAME',
  name: string
};

const StoreContext = createContext({} as {
  state: Store,
  dispatch: Dispatch<Actions>
});

const reduce: Reducer<Store, Actions> = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return {...state, timerName: action.name };
  }
};

export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reduce, initialStore);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};