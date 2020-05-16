// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const WebSocket = require('ws');

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
		const wss = new WebSocket.Server({port: 9000});
		/* const sockets: any[] = []; */

		wss.on('connection', (socket: any) => {
			console.log('[Speech to Text] New WebSocket connection');
			/* sockets.push(socket); */

			socket.on('message', (data: string) => {
				console.log(`[Speech to Text] New WebSocket message: ${data}`);
				// sockets.forEach(ws => ws.send(data));
				vscode.window.showInformationMessage(data as string);
			});
		});

		/* const socket = new WebSocket('ws://localhost:9000');

		socket.addEventListener('open', (e: any) => {
			console.log('[Speech to Text] Connected to WebSocket at ws://localhost:9000');
			// Display a message box to the user
			vscode.window.showInformationMessage('[Speech to Text] Connected to WebSocket at ws://localhost:9000');
		});
		socket.addEventListener('message', (e: any) => {
			console.log(`[Speech to Text] message received from WebSocket: ${e.data as string}`);
			vscode.window.showInformationMessage(e.data as string);
		}); */
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
