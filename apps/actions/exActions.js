export const DEFAULT_ACTION = 'DEFAULT_ACTION';

export function def_action (words) {
	return {
		type: DEFAULT_ACTION,
		words
	}
}