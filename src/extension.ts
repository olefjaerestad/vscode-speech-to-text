// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');
const WebSocket = require('ws');
const express = require('express');
const open = require('open');
const app = express();
const port = 9000;
const socketPort = 9001;

app.use('/', express.static(path.join(__dirname, '../client')));
app.listen(port, () => {
	vscode.window.showInformationMessage(`[Speech to Text] Server running at localhost:${port}`);
	open(`http://localhost:${port}`);
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[Speech to Text] Congratulations, your extension "vscode-speech-to-text" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stt.dictate', () => {
		// The code you place here will be executed every time your command is executed
		const wss = new WebSocket.Server({port: socketPort});

		wss.on('connection', (socket: any) => {
			// Display a message box to the user
			console.log('[Speech to Text] New WebSocket connection');
			vscode.window.showInformationMessage('[Speech to Text] New WebSocket connection');

			socket.on('message', (data: string) => {
				console.log(`[Speech to Text] New WebSocket message: ${data as string}`);

				/* vscode.languages.registerCompletionItemProvider('javascript', {
					provideCompletionItems: (doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionList> => {
						console.log('[Speech to Text] inside');
						return new vscode.CompletionList([
							{
								label: 'I am a method',
								kind: 1
							},
							{
								label: 'I am a function',
								kind: 2
							},
							{
								label: 'I am a property',
								kind: 9
							},
							{
								label: 'I don\'t have a kind',
							},
						]);
					}
				}, '.'); */ // todo: trigger this programmatically. Update: don' think we need this at all since we can use the code below instead?

				/**
				 * Add text to currently open document/file.
				 * todo: Add support for special characters (enter, space, tab, backspace, arrows, etc). Use vscode.commands.
				 * todo: Add support for removing text. Use vscode.commands.
				 * todo: Add support for multiple selections? Use vscode.commands.
				 */
				const path = vscode.window.activeTextEditor?.document.fileName;
				const cursorPos = vscode.window.activeTextEditor?.selection.active;
				if (path) {
					const edit = new vscode.WorkspaceEdit();
					const uri = vscode.Uri.file(path);
					const position = new vscode.Position(cursorPos?.line||0, cursorPos?.character||0);
					edit.insert(uri, position, data);
					vscode.workspace.applyEdit(edit).then(res => vscode.commands.executeCommand('editor.action.triggerSuggest'));
					// vscode.commands.getCommands(false).then(commands => console.log(JSON.stringify(commands))); // Get all available commands.
				}
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
