export interface ICommand {
	command: string,
	if?: boolean,
	params?: Array<any>,
}