import * as vscode from 'vscode';
import { ExtensionStore } from './app/shared/interfaces';
import { MOBTIME_SIDEBAR_ID, MOBTIME_STORE_KEY } from './constants';
import { SidebarProvider } from './MobtimePanel';


export function activate(context: vscode.ExtensionContext) {
  const updateStore = (store?: ExtensionStore) => {
    if (!store) {
      context.globalState.update(MOBTIME_STORE_KEY, undefined);
      return;
    }
    context.globalState.update(MOBTIME_STORE_KEY, JSON.stringify(store));
  };

  const sidebarProvider = new SidebarProvider(
    context.extensionUri,
    updateStore,
    JSON.parse(context.globalState.get(MOBTIME_STORE_KEY) || '{}') as ExtensionStore,
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      MOBTIME_SIDEBAR_ID,
      sidebarProvider,
    )
  );
}

export function deactivate() {}
