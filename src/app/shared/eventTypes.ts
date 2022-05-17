export interface GoalType {
  id: string;
  text: string;
  completed: boolean;
}
export interface Store {
  timerName?: string;
  viewZoom?: number;
  timerServer?: string;
  isOwner?: boolean;
  activeTabIndex?: number;
  mob?: {
    id: string;
    name: string;
  }[];
  goals?: GoalType[];
  settings?: {
    mobOrder: string,
    duration: number;
  },
  timerDuration?: number;
  timerAction?: 'start' | 'pause' | 'complete';
}

type CONNECT = {
  type: 'CONNECT',
  name: string,
  server?: string
};

type STATE_UPDATE = {
  type: 'STATE_UPDATE',
  fullTimerState: Store,
};


type DISCONNECT = {
  type: 'DISCONNECT'
};

type INFO = {
  type: 'INFO',
  message: string;
};

type ERROR = {
  type: 'ERROR',
  message: string;
};

type ACTIVE_TAB = {
  type: 'ACTIVE_TAB',
  index: Store['activeTabIndex']
};

type VIEW_ZOOM = {
  type: 'VIEW_ZOOM',
  zoom: number
};

type TIMER_OWNER = {
  type: 'timer:ownership',
  isOwner: boolean
};

type NEW_CLIENT = {
  type: 'client:new',
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

export type Actions = CONNECT 
  | DISCONNECT 
  | ACTIVE_TAB
  | VIEW_ZOOM
  | NEW_CLIENT
  | MOB_UPDATE 
  | GOALS_UPDATE 
  | SETTINGS_UPDATE 
  | TIMER_OWNER
  | TIMER_START 
  | TIMER_PAUSE 
  | TIMER_COMPLETE
  | STATE_UPDATE
  | INFO 
  | ERROR
  | STATE_UPDATE;

export type VSCodeAPI = <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: Actions) => void;
};