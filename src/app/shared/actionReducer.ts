import { Reducer } from "react";
import { Actions, Store } from "./eventTypes";

const defaultState: Store = {
  activeTabIndex: 0,
  timerAction: 'complete',
  settings: {
    duration: 300000,
    mobOrder: 'Navigator,Driver'
  },
  goals: [],
  mob: [],
};

export const reducerApp: Reducer<Store, Actions> = (currentState, action) => {
  const state = {...defaultState, ...currentState };
  switch (action.type) {
    case 'CONNECT':
      return {
        ...state, 
        timerName: action.name,
      };
    case 'DISCONNECT':
      return {  };
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
        timerDuration: action.timerDuration,
      };
    default: 
      const { type, ...data } = action;
      return {...state, ...data };
  }
};