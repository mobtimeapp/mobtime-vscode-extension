import React, { 
  createContext, 
  useCallback, 
  useContext, 
  useEffect, 
  useState 
} from "react";
import { Connector } from "./components/Connector";
import { Loader } from "./components/UI/Loader";
import { ExtensionAction, ExtensionActions, ViewAction, ViewActions } from "./shared/actions";
import { ExtensionSettings, MobtimeState, ProjectSettings, VSCodeAPI } from "./shared/interfaces";

type StoredSettings = ProjectSettings & ExtensionSettings;

const MobtimeContext = createContext<{
  state: MobtimeState,
  extensionStore: StoredSettings,
} | undefined>(undefined);

const ActionDispatcherContext = createContext<(action: ExtensionActions) => void | undefined>(undefined);

export const useStore = () => {
  const store = useContext(MobtimeContext);
  if (!store) {
    throw Error('Mobtime provider is not given');
  }
  return store;
};

export const useDispatch = () => {
  const dispatch = useContext(ActionDispatcherContext);
  if (!dispatch) {
    throw Error('Mobtime provider is not given');
  }
  return dispatch;
};

interface MobtimeProviderProps {
  vscodeApi?: ReturnType<VSCodeAPI>
}

export const MobtimeProvider: React.FC<MobtimeProviderProps> = ({ children, vscodeApi }) => {
  const [extensionStore, setExtensionStore] = useState<ExtensionSettings | StoredSettings | undefined>();
  const [mobtimeState, setState] = useState<MobtimeState | undefined>();

  const dispatchAction = useCallback((action: ExtensionActions) => {
    // Intercept extension actions
    switch (action.type) {
      case ExtensionAction.DISCONNECT_MOBTIME: {
        setExtensionStore(({ viewZoom }) => ({ viewZoom }));
        setState(undefined);
        break;
      }
      case ExtensionAction.UPDATE_EXTENSION_STORE: {
        setExtensionStore(current => ({ ...current, ...action.data }));
        if (action.data.viewZoom) {
          (document.body.style as any).zoom = `${action.data.viewZoom || 100}%`;
        }
        break;
      }
    }
    vscodeApi?.postMessage(action);
  }, [vscodeApi]);

  useEffect(() => {
    const messageHandler = (e: MessageEvent<ViewActions>) => {
      switch (e.data.type) {
        case ViewAction.INITIAL_STORE:
          setExtensionStore(e.data.data);
          if (e.data.data.viewZoom) {
            (document.body.style as any).zoom = `${e.data.data.viewZoom || 100}%`;
          }
          break;
        case ViewAction.TIMER_SYNC:
          setState(e.data.data);
          break;
      }
    };
    window.addEventListener('message', messageHandler);
    dispatchAction({ type: ExtensionAction.REQUEST_STORE_SYNC });
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  if (!extensionStore) {
    return <Loader />;
  }

  return <ActionDispatcherContext.Provider value={dispatchAction}>
    {mobtimeState && 'timerName' in extensionStore 
    ? <MobtimeContext.Provider value={{ state: mobtimeState, extensionStore }}>
      {children}
    </MobtimeContext.Provider> 
    : <Connector />}
  </ActionDispatcherContext.Provider>;
};