const defaultColor = '[0m'; // default color code
const colors = new Map([
	['black', '[30m'], // color code for 'black'
	['red', '[31m'], // color code for 'red'
	['green', '[32m'], // color code for 'green'
	['yellow', '[33m'], // color code for 'yellow'
	['blue', '[34m'], // color code for 'blue'
	['purple', '[35m'], // color code for 'purple'
	['cyan', '[36m'], // color code for 'cyan'
	['white', '[37m'], // color code for 'white'
]);

// function to apply color to the given text using the specified color name
const applyColor = (colorName, text) => {
	const colorCode = colors.get(colorName) ?? defaultColor; // retrieve the color code from the 'colors' map or use the default color code
	return `\x1b${colorCode}${text}\x1b${defaultColor}`; // apply the color codes to the text and reset to the default color
};

export function colorize(color, text) {
	if (text) return applyColor(color, text); // if 'text' is provided, directly apply the color to it and return the result
	return (text) => applyColor(color, text); // if 'text' is not provided, return a function that accepts 'text' and applies the color to it
}
