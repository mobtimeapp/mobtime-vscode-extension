import * as vscode from "vscode";
import { Disposable } from "vscode";
import * as Websocket from "ws";
import { Actions } from "./app/shared/eventTypes";
import { millisToMinutes } from './app/shared/timeConverter';

type UpdateMobtimeFn = (timerName?: string) => void;

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  socket?: Websocket;
  updateMobTimeName: UpdateMobtimeFn;
  time?: number;
  timer?: NodeJS.Timeout;
  statusBar?: Disposable;

  constructor(updateMobTimeName: UpdateMobtimeFn, private readonly _extensionUri: vscode.Uri, mobTimeName?: string) {
    this.updateMobTimeName = updateMobTimeName;
    this.connectToSocket(mobTimeName);
  }

  public connectToSocket (name?: string) {
    if (name) {
      if (this.socket) {
        this.socket.url;
      }
      this.socket = new Websocket(`wss://mobtime.vehikl.com/${name}`);
      this.socket.on("open", () => {
        this.socket?.send(JSON.stringify({ type: 'client:new' }));
        this.socket?.on('message', e => {
          const action = JSON.parse(e.toString());
          this.timerActions(action);
          this._view?.webview.postMessage(action);
        });
      });
    }
  }

  public resolveWebviewView(panel: vscode.WebviewView) {
    this._view = panel;

    panel.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    panel.webview.html = this._getHtmlForWebview(panel.webview);

    panel.webview.onDidReceiveMessage(async (data: Actions) => {
      switch (data.type) {
        case "INFO": {
          if (!data.message) {
            return;
          }
          vscode.window.showInformationMessage(data.message);
          break;
        }
        case "ERROR": {
          if (!data.message) {
            return;
          }
          vscode.window.showErrorMessage(data.message);
          break;
        }
        case "CONNECT": {
          this.updateMobTimeName(data.name);
          this.connectToSocket(data.name);
          break;
        }
        case "DISCONNECT": {
          this.updateMobTimeName(undefined);
          this.socket?.close();
          break;
        }
        default: {
          this.timerActions(data);
          this.socket?.send(JSON.stringify(data));
          break;
        }
      }
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
        <script src="${scriptUri}"></script>
			</body>
			</html>`;
  }

  public timerActions (actions: Actions) {
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