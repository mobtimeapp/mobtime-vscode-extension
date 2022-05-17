import * as vscode from "vscode";
import { ExtensionStore, MobtimeState, ProjectSettings } from "./app/shared/interfaces";
import { ExtensionAction, ExtensionActions, ViewAction, ViewActions } from "./app/shared/actions";
import {Mobtime, nodeWebsocket, Message} from '@mobtime/sdk';
import { millisToMinutes } from './app/shared/timeConverter';
import { OPEN_SIDEBAR_COMMAND, START_TIMER_COMMAND, TOGGLE_TIMER_COMMAND } from "./constants";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private state?: MobtimeState;
  private mobtimer: Mobtime = null;
  private store?: ExtensionStore;
  private updateStore: (store?: ExtensionStore) => void;

  private workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.path || 'no-workspace';
  private workspaceName = vscode.workspace.workspaceFolders?.[0]?.name || 'no-workspace';
  private getProjectSettings = (): ProjectSettings | undefined => this.store?.projects?.[this.workspacePath];

  private statusBarCounter: NodeJS.Timeout | null = null;
  private statusBarTimerItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  private statusBarPauseAndPlayItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

  constructor(
    private readonly _extensionUri: vscode.Uri,
    _updateStore: (store?: ExtensionStore) => void,
    _store?: ExtensionStore,
    ) {
      vscode.commands.registerCommand(START_TIMER_COMMAND, () => {
        this._onViewAction({
          type: ExtensionAction.START,
        });
      });

      vscode.commands.registerCommand(TOGGLE_TIMER_COMMAND, () => {
        if (this.state?.timer?.startedAt) {
          this._onViewAction({
            type: ExtensionAction.PAUSE,
          });
          return;
        }
        this._onViewAction({
          type: ExtensionAction.START,
        });
      });

      this.store = _store;

      this.updateStore = (newStore?: ExtensionStore) => {
        this.store = newStore;
        _updateStore(newStore);
      };
  
      if (this.getProjectSettings()?.timerName) {
        this._connectToMobtime();
      }
  }

  // Calls when sidebar opens
  public async resolveWebviewView(panel: vscode.WebviewView) {
    this.view = panel;
    
    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    panel.webview.html = this._getHtmlForWebview(panel.webview);

    panel.onDidChangeVisibility(async (e) => {
      if (panel.visible) {
        (this.view || panel).webview.html = this._getHtmlForWebview(panel.webview);
      }
    });

    panel.webview.onDidReceiveMessage(this._onViewAction);
  }


  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "main.js")
    );

    return `<!DOCTYPE html>
     <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
        <script>
          const vscodeApi = acquireVsCodeApi();
        </script>
        <script src="${scriptUri}"></script>
      </body>
      </html>`;
  }

  private _listenMobtimeEvents(mobtime: Mobtime) {
    this.mobtimer = mobtime;

    this._dispatchViewAction({
      type: ViewAction.TIMER_SYNC,
      data: mobtime.state,
    });

    this.updateStatusBarTimer();
    this.state = mobtime.state;

    mobtime.on(Message.MOB_UPDATE, (() => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });
      this.state = mobtime.state;
      this.updateStatusBarTimer();
      if (!this.view?.visible) {
        const message = `Mob Order, ${(this.state?.settings?.mobOrder.split(',') || [])
        .map((order, index) => `${order}: ${this.state?.mob?.[index]?.name || '-'}`)
        .join(', ')}`;
        this.showNotification(message);
      }
    }).bind(this));

     mobtime.on(Message.GOALS_UPDATE, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });
      this.state = mobtime.state;
      if (!this.view?.visible) { 
        this.showNotificationWithOpenTimerAction('Mobtimer Goals updated');
      }
    });

    mobtime.on(Message.SETTINGS_UPDATE, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });

      this.state = mobtime.state;
      this.updateStatusBarTimer();
      if (!this.view?.visible) { 
        this.showNotificationWithOpenTimerAction('Mobtimer Settings updated');
      }
    });

    mobtime.on(Message.TIMER_START, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });

      this.state = mobtime.state;
      this.updateStatusBarTimer();
    });
  
    mobtime.on(Message.TIMER_PAUSE, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });

      this.state = mobtime.state;
      this.updateStatusBarTimer();
    });
  
    mobtime.on(Message.TIMER_UPDATE, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });

      this.state = mobtime.state;
      this.updateStatusBarTimer();
    });

    mobtime.on(Message.TIMER_COMPLETE, () => {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: mobtime.state,
      });

      this.state = mobtime.state;
      this.updateStatusBarTimer();
      const START_TIMER_ACTION_LABEL = 'Start Next Turn';
      vscode.window.showInformationMessage('⏱️⏱️ The Timer is up ⏱️⏱️', START_TIMER_ACTION_LABEL).then((e) => {
        if (e === START_TIMER_ACTION_LABEL) {
          vscode.commands.executeCommand(START_TIMER_COMMAND);
        }
      });
    });
  }

  private _dispatchViewAction(action: ViewActions) {
    this.view?.webview.postMessage(action);
  }

  private _connectToMobtime = async (newProjectSettings?: ProjectSettings) => {
    const projectSettings = newProjectSettings || this.getProjectSettings();

    if (!projectSettings) {
      return;
    }

    const mobtimer = await new Mobtime()
      .usingSocket(
        nodeWebsocket(
          projectSettings.timerName,
          {
            domain: projectSettings.server || "mobti.me",
            secure: true
          }
        ));

    this._listenMobtimeEvents(mobtimer);
    
    this.statusBarTimerAction.updateLabels();
  };

  private _syncMobtimeSidebar = async () => {
    const projectSettings = this.getProjectSettings();

    if (this.state) {
      this._dispatchViewAction({
        type: ViewAction.TIMER_SYNC,
        data: this.state
      });
    }
    
    this._dispatchViewAction({
      type: ViewAction.INITIAL_STORE,
      data: {
        viewZoom: 100,
        ...this.store?.settings,
        ...projectSettings,
      },
    });
  };

  private _onViewAction = async (action: ExtensionActions) => {
    switch (action.type) {
      case ExtensionAction.REQUEST_STORE_SYNC: {
        this._syncMobtimeSidebar();
        break;
      }
      case ExtensionAction.CONNECT_MOBTIME: {
        const store = {
          timerName: action.data.name,
          server: action.data.server,
          activeTabIndex: 0,
        };
        this.updateStore({
          ...this.store,
          projects: {
            ...this.store?.projects,
            [this.workspacePath]: store,
          }
        });
        await this._connectToMobtime(store);
        this._syncMobtimeSidebar();
        break;
      }
      case ExtensionAction.DISCONNECT_MOBTIME: {
        delete this.store?.projects?.[this.workspacePath];
        this.updateStore(this.store);
        this.statusBarTimerAction.updateLabels();
        try {
          this.mobtimer.disconnect();
        } catch (error) {
          console.log(error);
        }
        break;
      }
      case ExtensionAction.UPDATE_EXTENSION_STORE: {
        if (this.store) {
          const { viewZoom, workspacePath: _, ...projectSettings } = action.data;
          this.updateStore({
            ...this.store,
            settings: {
              viewZoom: viewZoom || this.store?.settings?.viewZoom,
            },
            projects: {
              ...this.store?.projects,
              [this.workspacePath]: {
                  timerName: this.workspaceName,
                  server: 'mobti.me',
                  activeTabIndex: 0,
                ...this.store?.projects?.[this.workspacePath],
                ...projectSettings,
              },
            }
          });
          this.updateStore({...this.store, ...action.data});
        }
        break;
      }
      case ExtensionAction.SET_MOB: {
        this.mobtimer.mob().replaceAll(action.mob).commit();
        break;
      }
      case ExtensionAction.SET_GOALS: {
        this.mobtimer.goals().replaceAll(action.goals).commit();
        break;
      }
      case ExtensionAction.SET_SETTINGS: {
        const settings = this.mobtimer.settings();
        const timer = this.mobtimer.timer();
        settings._values = action.settings;
        timer._values.startedAt = null;
        if (action.settings?.duration) {
          timer._values.duration = action.settings.duration;
        } else {
          timer._values.duration = settings.duration;
        }
        settings.commit();
        timer._msg = Message.TIMER_UPDATE;
        timer.commit();
        break;
      }
      case ExtensionAction.PAUSE: {
        this.mobtimer.timer().pause().commit();
        break;
      }
      case ExtensionAction.START: {
        if(this.mobtimer.state.timer.duration > 0) {
          this.mobtimer.timer().resume().commit();
          break;
        }
        this.mobtimer.timer().start().commit();
        break;
      }
      case ExtensionAction.CLEAR: {
        this.mobtimer.timer().complete().commit();
        break;
      }
    }
  };

  /**
   *  Status Bar
   */

  private statusBarTimerAction = {
    updateLabels: () => {
      const projectSettings = this.getProjectSettings();
      this.statusBarTimerItem.text = `$(watch) Mobtimer${projectSettings?.timerName ? " : " + projectSettings?.timerName: ''}`;
      this.statusBarTimerAction.complete();

      this.statusBarTimerItem.command = OPEN_SIDEBAR_COMMAND;
      this.statusBarPauseAndPlayItem.command = TOGGLE_TIMER_COMMAND;
      
      this.statusBarTimerItem.show();
      if (projectSettings?.timerName) {
        this.statusBarPauseAndPlayItem.show();
      }
    },
    complete: () => {
      this.statusBarPauseAndPlayItem.text = `$(refresh) 00:00`;
    },
    pause: (duration: number) => {
      this.statusBarTimerAction.clearTimer();
      this.statusBarPauseAndPlayItem.text = `$(run) ${millisToMinutes(duration)}`;
    },
    continue: (remainingTime: number) => {
      this.statusBarPauseAndPlayItem.text = `$(debug-pause) ${millisToMinutes(remainingTime)}`;
    },
    clearTimer: () => {
      if (this.statusBarCounter) {
        clearInterval(this.statusBarCounter);
      }
      this.statusBarCounter = null;
    }
  };

  private updateStatusBarTimer() {
    const timer = this.state?.timer;
    if (!timer) { return; }

    if (!timer.startedAt) {
      // Paused
      if (this.statusBarCounter) {
        clearInterval(this.statusBarCounter);
        this.statusBarCounter = null;
      }
      if (timer.duration === 0) {
        this.statusBarTimerAction.complete();
        return;
      }
      this.statusBarTimerAction.pause(timer.duration);
      return;
    }

    // Timer is started
    const elapsedTime = Date.now() - (timer.startedAt || 0);
    const remainingTime = timer.duration - elapsedTime;
    if (remainingTime <= 0) {
      this.statusBarTimerAction.complete();
      return;
    }


    // Timer is running
    if (!this.statusBarCounter) {
      this.statusBarCounter = setInterval(this.updateStatusBarTimer.bind(this), 200);
    }
    this.statusBarTimerAction.continue(remainingTime);
  }

  /**
   *  Notification
   */

  
  private showNotificationWithOpenTimerAction(message: string) {
    const OPEN_MOBTIMER_ACTION = 'Open Mobtime';
    vscode.window.showInformationMessage(message, OPEN_MOBTIMER_ACTION).then((e) => {
      if (e === OPEN_MOBTIMER_ACTION) {
        vscode.commands.executeCommand('mobtime-sidebar.focus');
      }
    });
  }

  private showNotification(message: string) {
    vscode.window.showInformationMessage(message);
  }
}