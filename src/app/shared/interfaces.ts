import { ExtensionActions } from "./actions";

export interface ProjectSettings {
  server: string;
  timerName: string;
  activeTabIndex: number
}

export interface ExtensionSettings {
  viewZoom?: number;
}

export type MobtimerSettings = ExtensionSettings & ProjectSettings & {
  workspacePath?: string;
};

export interface ExtensionStore {
  settings?: ExtensionSettings,
  projects?: Record<string, ProjectSettings>;
}

export interface GoalType {
  id: string;
  text: string;
  completed: boolean;
}

export interface MobtimeState {
  mob?: {
    id: string;
    name: string;
  }[];
  goals?: GoalType[];
  settings?: {
    mobOrder: string,
    duration: number;
  },
  timer: {
    duration: number;
    // action: 'start' | 'pause' | 'complete';
    startedAt?: number;
  }
}

export type VSCodeAPI = <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: ExtensionActions) => void;
};