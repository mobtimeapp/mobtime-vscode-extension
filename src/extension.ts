import * as vscode from 'vscode';
import { Store } from './app/shared/eventTypes';
import { SidebarProvider } from './MobtimePanel';

const MOBTIME_STORE_KEY = 'mobtime-store';

export function activate(context: vscode.ExtensionContext) {
	const updateStore = (store?: Store) => {
		context.globalState.update(MOBTIME_STORE_KEY, JSON.stringify(store));
	};
	const sidebarProvider = new SidebarProvider(
		updateStore,
		context.extensionUri,
		JSON.parse(context.globalState.get(MOBTIME_STORE_KEY) || '{}')
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"mobtime-sidebar",
			sidebarProvider,
		)
	);

}

export function deactivate() {}
