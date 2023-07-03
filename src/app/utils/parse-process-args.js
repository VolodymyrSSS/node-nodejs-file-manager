export function parseProcessArgs(process, prefix = '--') {
	const args = process.argv.slice(2); // retrieve the command-line arguments, excluding the first two
	return args.reduce((acc, arg) => {
		if (!arg.startsWith(prefix)) return acc; // skip arguments that do not start with the specified prefix
		const [key, value] = arg.slice(prefix.length).split('='); // extract the key and value from the argument
		return acc.set(key, value); // add the key-value pair to the Map
	}, new Map()); // return the resulting Map containing the parsed arguments
}
