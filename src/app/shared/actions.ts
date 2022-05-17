import { MobtimerSettings, MobtimeState } from './interfaces';

export enum ExtensionAction {
  CONNECT_MOBTIME,
  DISCONNECT_MOBTIME,
  UPDATE_EXTENSION_STORE,
  SET_MOB,
  SET_GOALS,
  SET_SETTINGS,
  PAUSE,
  START,
  CLEAR,
  REQUEST_STORE_SYNC
}

export enum ViewAction {
  INITIAL_STORE,
  TIMER_SYNC
}

export type ViewActions =
  | { type: ViewAction.INITIAL_STORE, data: Partial<MobtimerSettings> }
  | { type: ViewAction.TIMER_SYNC, data: MobtimeState };

export type ExtensionActions = 
  | { type: ExtensionAction.CONNECT_MOBTIME, data: { name: string, server: string } }
  | { type: ExtensionAction.DISCONNECT_MOBTIME }
  | { type: ExtensionAction.UPDATE_EXTENSION_STORE, data: Partial<MobtimerSettings> }
  | { type: ExtensionAction.SET_MOB, mob: MobtimeState['mob'] }
  | { type: ExtensionAction.SET_GOALS, goals: MobtimeState['goals'] }
  | { type: ExtensionAction.SET_SETTINGS, settings: MobtimeState['settings'] }
  | { type: ExtensionAction.REQUEST_STORE_SYNC }
  | { type: ExtensionAction.PAUSE }
  | { type: ExtensionAction.START }
  | { type: ExtensionAction.CLEAR };
