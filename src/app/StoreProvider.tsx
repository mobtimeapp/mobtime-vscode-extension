import React, { 
  createContext, 
  Dispatch, 
  useCallback, 
  useContext, 
  useEffect, 
  useReducer, 
  useState 
} from "react";
import { Loader } from "./components/UI/Loader";
import { reducerApp } from "./shared/actionReducer";
import { VSCodeAPI, Store, Actions } from './shared/eventTypes';

declare var vscodeApi: ReturnType<VSCodeAPI>;
declare var storeData: string;

const StoreContext = createContext({} as {
  state: Store,
  dispatch: Dispatch<Actions>,
  vscodeApi: ReturnType<VSCodeAPI>,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducerApp, (JSON.parse(storeData) || {}));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const messageHandler = (e: MessageEvent<Actions>) => {
      if (e.data.type === 'timer:ownership') {
        setLoading(false);
      }
      dispatch(e.data);
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const userDispatcher = useCallback((action: Actions) => {
    if (action.type === 'CONNECT' && !state.timerName) {
      setLoading(true);
    }
    dispatch(action);
    vscodeApi.postMessage(action);
  }, [dispatch, vscodeApi, state.timerName]);

  return (
    <StoreContext.Provider value={{ state, dispatch: userDispatcher, vscodeApi }}>
      {loading && <Loader />}
      {!loading && children}
    </StoreContext.Provider>
  );
};