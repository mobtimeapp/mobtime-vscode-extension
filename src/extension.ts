import * as vscode from 'vscode';
import { SidebarProvider } from './MobtimePanel';

const MOBTIME_NAME_KEY = 'mobtime-name';

export function activate(context: vscode.ExtensionContext) {
	const updateMobtimeName = (name?: string) => {
		context.globalState.update(MOBTIME_NAME_KEY, name);
	};

	const sidebarProvider = new SidebarProvider(
		updateMobtimeName,
		context.extensionUri,
		context.globalState.get(MOBTIME_NAME_KEY)
	);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"mobtime-sidebar",
			sidebarProvider
		)
	);

}

export function deactivate() {}
