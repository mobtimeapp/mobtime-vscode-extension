import * as vscode from "vscode";
import * as Websocket from "ws";
import { Actions, Store } from "./app/shared/eventTypes";
import { reducerApp } from "./app/shared/actionReducer";
import { millisToMinutes } from './app/shared/timeConverter';

type updateStore = (store: Store) => void;

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _store?: Store;
  _updateStore: updateStore;

  socket?: Websocket;
  time?: number;
  timer?: NodeJS.Timeout;
  connected?: boolean;

  
  public get store(): Store | undefined {
    return this._store;
  }
  
  public set store(value: Store | undefined) {
    this._store = value;
    if (value) {
      this._updateStore(value);
    }
  }
  

  constructor(updateStore: updateStore, private readonly _extensionUri: vscode.Uri, store?: Store) {
    this._updateStore = updateStore;
    this.store = store;
    this.connectToSocket();
  }

  private sendAction (action: Actions) {
    this.socket?.send(JSON.stringify(action));
  }

  private sendUIAction (action: Actions) {
    this._view?.webview.postMessage(action);
  }

  private connectToSocket () {
    if (this.store?.timerName) {
      if (this.socket) {
        this.socket.url;
      }
      this.socket = new Websocket(`wss://mobtime.vehikl.com/${this.store.timerName}`);
      this.socket.on("open", () => {
        this.sendAction({ type: 'client:new' });
        this.socket?.on('message', e => {
          const action = JSON.parse(e.toString());
          this.incomingActionsHandlers(action);
          this.timerActionsHandlers(action);
        });
      });
    }
  }

  public resolveWebviewView(panel: vscode.WebviewView) {
    this._view = panel;
    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    panel.webview.html = this._getHtmlForWebview(panel.webview);

    panel.onDidChangeVisibility(() => {
      if (panel.visible) {
        (this._view || panel).webview.html = this._getHtmlForWebview(panel.webview);
      }
    });

    panel.webview.onDidReceiveMessage((action) => {
      this.outgoingActionsHandlers(action);
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
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
          const storeData = '${JSON.stringify({...this.store, timerDuration: this.time && this.time - 1000 })}';
        </script>
        <script src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  private incomingActionsHandlers (action: Actions) {
    this.store = reducerApp(this.store || {}, action);
    switch (action.type) {
      case 'timer:ownership':
      case 'client:new':
        if (this.store.isOwner) {
          this.sendAction({
            type: 'settings:update',
            settings: this.store.settings
          });
          this.sendAction({
            type: 'mob:update',
            mob: this.store.mob
          });
          this.sendAction({
            type: 'goals:update',
            goals: this.store.goals
          });
          if (this.store.timerAction === 'start') {
            this.sendAction({
              type: "timer:start",
              timerDuration: this.time
            });
          } else if (this.store.timerAction === "pause") {
            this.sendAction({
              type: "timer:pause",
              timerDuration: this.time
            });
          } else if (this.store.timerAction === 'complete') {
            this.sendAction({
              type: "timer:complete",
              timerDuration: 0
            });
          }
        }
      default:
        this.sendUIAction(action);
        break;
    }
  }

  private outgoingActionsHandlers (action: Actions) {
    this.store = reducerApp(this.store || {}, action);
    this.timerActionsHandlers(action);
    switch (action.type) {
      case "CONNECT": {
        this.store = {
          ...this.store,
          timerName: action.name
        };
        this.connectToSocket();
        break;
      }
      case "DISCONNECT": {
        this.socket?.close();
        this.store = {};
        break;
      }
      case "ACTIVE_TAB": {
        break;
      }
      default:
        this.sendAction(action);
        break;
    }
  }

  private timerActionsHandlers (actions: Actions) {
    switch (actions.type) {
      case "timer:start": {
        this.time = actions.timerDuration;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.time = this.time && this.time - 1000;
        this.timer = setInterval(() => {
          if (this.time) {
            const newTime = this.time - 1000;
            this.time = newTime;
            statusBarMsg(`$(watch) Mobtime : ${millisToMinutes(newTime)}`);
            if (this.time <= 0 && this.timer) {
              clearInterval(this.timer);
              if (this.store?.isOwner) {
                const [navigator, ...otherMobs] = (this.store?.mob || []);
                const rotateMobOrder = [...otherMobs, navigator];
                this.store.mob = rotateMobOrder;
                this.sendAction({
                  type: "mob:update",
                  mob: rotateMobOrder,
                });
                this.sendUIAction({
                  type: "mob:update",
                  mob: rotateMobOrder,
                });
                this.sendAction({
                  type: "timer:complete",
                  timerDuration: 0,
                });
                this.sendUIAction({
                  type: "timer:complete",
                  timerDuration: 0,
                });
                newMobStatus(rotateMobOrder, this.store.settings?.mobOrder);
              }
              timerComplete();
            }
          }
        }, 1000);
        break;
      }
      case "timer:pause": {
        if (this.timer) {
          clearInterval(this.timer);
          statusBarMsg("$(debug-pause) Mobtime : Pause");
        }
        break;
      }
      case "timer:complete": {
        if (this.timer) {
          clearInterval(this.timer);
          timerComplete();
        }
        break;
      }
      case "mob:update": {
        newMobStatus(this.store?.mob, this.store?.settings?.mobOrder);
      }
    }
  }

}

const statusBarMsg = (message: string) => {
  vscode.window.setStatusBarMessage(message);
};

const timerComplete = () => {
  vscode.window.showInformationMessage("⏰ ⏰ Timer ⏰ ⏰");
  statusBarMsg("");
  statusBarMsg("$(getting-started-item-checked) Mobtime : Completed");
};

const newMobStatus = (mob: Store['mob'], order?: string) => {
  const mobOrders = order?.split(',');
  if (mobOrders && mob && mob?.length >= mobOrders.length) {
    vscode.window.showInformationMessage(`${mobOrders.map((o, i) => `${o}: 👤 ${mob[i].name}`).join(', ')}`);
  }
};
