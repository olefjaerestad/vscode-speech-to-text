/**
 * Map certain spoken phrases to other phrases.
 * Key is the original phrase, value the target phrase.
 */
export const PHRASE_MAPPINGS: Map<Array<string>, string> = new Map([
	[['2'], 'to'],
	[['3'], 'tree'],
	[['4', 'fore'], 'for'],
]);