// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { COMMAND_MAPPINGS } from './constant/command-mappings';
const path = require('path');
const WebSocket = require('ws');
const express = require('express');
const open = require('open');
const app = express();
const port = 9000;
const websocketPort = 9001;

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
		const wss = new WebSocket.Server({port: websocketPort});

		wss.on('connection', (socket: any) => {
			// Display a message box to the user
			console.log('[Speech to Text] New WebSocket connection');
			vscode.window.showInformationMessage('[Speech to Text] New WebSocket connection');

			socket.on('message', (message: string) => {
				console.log(`[Speech to Text] New WebSocket message: ${message}`);

				/**
				 * Add text to currently open document/file.
				 * todo: Add support for special characters (enter, space, tab, backspace, etc). Use vscode.commands.
				 * todo: Add support for removing text. Use vscode.commands.
				 * todo: Add support for multiple selections? Use vscode.commands.
				 */
				const path = vscode.window.activeTextEditor?.document.fileName;
				
				if (path) {
					if (
						Object.keys(COMMAND_MAPPINGS).includes(message) && 
						(
							(Object.keys(COMMAND_MAPPINGS[message]).includes('if') && COMMAND_MAPPINGS[message].if) || 
							!Object.keys(COMMAND_MAPPINGS[message]).includes('if')
						)
					) {
						// console.log('exec command for', message, ...(COMMAND_MAPPINGS[message].params || []));
						vscode.commands.executeCommand(COMMAND_MAPPINGS[message].command, ...(COMMAND_MAPPINGS[message].params || []));
					} else {
						const edit = new vscode.WorkspaceEdit();
						const uri = vscode.Uri.file(path);
						const cursorPos = vscode.window.activeTextEditor?.selection.active;
						const position = new vscode.Position(cursorPos?.line||0, cursorPos?.character||0);
						edit.insert(uri, position, message);
						vscode.workspace.applyEdit(edit).then(res => vscode.commands.executeCommand('editor.action.triggerSuggest'));
					}

					// Get all available commands.
					// vscode.commands.getCommands(false).then(commands => {
					// 	commands.forEach(command => {
					// 		if (command.toLowerCase().includes('suggestion')) { // next, down, suggestion
					// 			console.log(command);
					// 		}
					// 	});
					// });
				}
			});
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
