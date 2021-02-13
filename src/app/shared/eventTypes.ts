export interface GoalType {
  id: string;
  text: string;
  completed: boolean;
}
export interface Store {
  timerName?: string;
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
  name: string
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
  | MOB_UPDATE 
  | GOALS_UPDATE 
  | SETTINGS_UPDATE 
  | TIMER_START 
  | TIMER_PAUSE 
  | TIMER_COMPLETE 
  | INFO 
  | ERROR;

export type VSCodeAPI = <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: Actions) => void;
};