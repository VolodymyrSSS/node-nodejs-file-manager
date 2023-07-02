// takes a string and splits it into an array of strings using spaces as the delimiter
export function parsePathList(str) {
	return str.split(/(?<!\\)\s/).map((v) => v.replace(/\\ /g, ' '));
}
/* The regular expression /(?<!\\)\s/ uses a negative lookbehind assertion (?<!\\) to match whitespace characters that are not preceded by a backslash. This ensures that escaped spaces are not treated as separators.
The resulting array is transformed using the map method to replace any occurrences of \\ (backslash followed by a space) with a single space.*/
