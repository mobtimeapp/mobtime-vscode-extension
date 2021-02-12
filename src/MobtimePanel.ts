import * as vscode from "vscode";
import * as Websocket from "ws";
import { Actions, Store } from "./app/shared/eventTypes";
export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  socket?: Websocket;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public connectToSocket (name?: string) {
    if (name) {
      this.socket = new Websocket(`wss://mobtime.vehikl.com/${name}`);
      this.socket.on("open", () => {
        this.socket?.send(JSON.stringify({ type: 'client:new' }));
        this.socket?.on('message', e => {
          this._view?.webview.postMessage(JSON.parse(e.toString()));
        });
      });
    }
  }

  public resolveWebviewView(panel: vscode.WebviewView, context: { state: Store }) {
    this.connectToSocket(context.state?.timerName);
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
          this.connectToSocket(data.name);
          break;
        }
        case "DISCONNECT": {
          this.socket?.close();
          break;
        }
        default: {
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
}