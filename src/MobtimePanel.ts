import * as vscode from "vscode";
import { Disposable } from "vscode";
import * as Websocket from "ws";
import { Actions, Store } from "./app/shared/eventTypes";
import { reducerApp } from "./app/shared/actionReducer";
import { millisToMinutes } from './app/shared/timeConverter';

type updateStore = (store: Store) => void;

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  socket?: Websocket;
  updateStore: updateStore;
  time?: number;
  timer?: NodeJS.Timeout;
  statusBar?: Disposable;
  store?: Store;

  constructor(updateStore: updateStore, private readonly _extensionUri: vscode.Uri, store?: Store) {
    this.updateStore = updateStore;
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
          this.timerActionsHandlers(action);
          this.incomingActionsHandlers(action);
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
    this.store;
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
          const storeData = '${JSON.stringify(this.store)}';
        </script>
        <script src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  private incomingActionsHandlers (action: Actions) {
    this.store = reducerApp(this.store || {}, action);
    this.timerActionsHandlers(action);
    switch (action.type) {
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
        }
        break;
      default:
        this.sendUIAction(action);
        break;
    }
    this.updateStore(this.store);
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
    this.updateStore(this.store);
  }

  private timerActionsHandlers (actions: Actions) {
    switch (actions.type) {
      case "timer:start": {
        this.time = actions.timerDuration;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          if (this.time) {
            const newTime = this.time - 1000;
            this.time = newTime;
            vscode.window.setStatusBarMessage(`$(watch) Mobtime : ${millisToMinutes(newTime)}`);
            if (this.time <= 0 && this.timer) {
              clearInterval(this.timer);
              const [navigator, ...otherMobs] = (this.store?.mob || []);
              this.sendAction({
                type: "mob:update",
                mob: [...otherMobs, navigator],
              });
              this.sendUIAction({
                type: "mob:update",
                mob: [...otherMobs, navigator],
              });
              this.socket?.send(JSON.stringify({ type: "timer:complete" } as Actions));
              vscode.window.showInformationMessage("!! Timer !!");
              vscode.window.setStatusBarMessage("");
              vscode.window.setStatusBarMessage("$(getting-started-item-checked) Mobtime : Completed");
            }
          }
        }, 1000);
        break;
      }
      case "timer:pause": {
        if (this.timer) {
          clearInterval(this.timer);
          vscode.window.setStatusBarMessage("$(debug-pause) Mobtime : Pause");
        }
        break;
      }
      case "timer:complete": {
        if (this.timer) {
          clearInterval(this.timer);
          vscode.window.showInformationMessage("!! Timer !!");
          vscode.window.setStatusBarMessage("$(getting-started-item-checked) Mobtime");
        }
        break;
      }
      default:
        break;
    }
  }
}