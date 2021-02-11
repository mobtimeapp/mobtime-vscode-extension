import * as vscode from 'vscode';
import { SidebarProvider } from './MobtimePanel';

export function activate(context: vscode.ExtensionContext) {

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"mobtime-sidebar",
			sidebarProvider
		)
	);

}

export function deactivate() {}
