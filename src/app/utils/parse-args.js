// parse a string of arguments and extract only those that start with a specific prefix
export function parseArgs(str, prefix = '--') {
	return str.split(/\s+/).filter((substring) => substring.startsWith(prefix));
}
