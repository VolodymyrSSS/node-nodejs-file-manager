import { colorize } from '../utils/colorize.js';

export class CommandService {
	#exit = null; // private field to store the exit function

	init(exit) {
		this.#exit = exit; // sets the exit function
	}

	// handles the input command
	handle(input) {
		if (!input) return; // if input is empty, return early
		const [command, ...args] = input.split(' '); // split input into command and arguments
		const handler = this.#commands.get(command); // retrieve the handler function for the command
		if (handler)
			handler(...args); // if a handler is found, call it with the arguments
		else throw new Error('Invalid input'); // throw an error for invalid input
	}

	// private map to store commands and their handler functions
	#commands = new Map([
		['echo', (...args) => console.log(colorize('yellow', args.join(' ')))], // handler function for 'echo' command
		['kek', () => this.handle('echo someone keked!')], // handler function for 'kek' command
		['.exit', () => this.#exit()], // handler function for '.exit' command
	]);
}
