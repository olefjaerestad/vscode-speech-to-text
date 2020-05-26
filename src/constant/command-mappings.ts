import { ICommand } from '../interface/command';

export const COMMAND_MAPPINGS: {[key:string]: ICommand} = {
	down: {
		command: 'cursorMove',
		params: [{
			to: 'down',
		}],
	},
	enter: {
		command: 'acceptSelectedSuggestion',
		if: true, // Todo: Check if suggestion dialog is open. If not, add new line instead.
	},
	left: {
		command: 'cursorMove',
		params: [{
			to: 'left',
		}],
	},
	next: {
		command: 'selectNextSuggestion',
	},
	previous: {
		command: 'selectPrevSuggestion',
	},
	right: {
		command: 'cursorMove',
		params: [{
			to: 'right',
		}],
	},
	up: {
		command: 'cursorMove',
		params: [{
			to: 'up',
		}],
	},
};