import { createInterface } from 'readline';
import { colorize } from '../utils/colorize.js';

export class ReplService {
	#rl; // private field to store the readline interface

	constructor({ exit, input, output, prompt }) {
		this.#rl = createInterface({ input, output, prompt }); // creates a readline interface
		this.exit = exit; // sets the exit function
	}

	// initializes the ReplService with helloMessage, exitMessage, and handleInput callback
	init({ process, helloMessage, exitMessage, handleInput }) {
		const rl = createInterface({
			input: process.stdin,
			output: process.stdout,
			prompt: colorize('purple', '> '),
		});
		rl.on('close', () => {
			console.log(exitMessage); // logs the exitMessage
			process.exit();
		});

		// event handler for the 'line' event
		rl.on('line', (line) => {
			handleInput(line.trim()); // calls the handleInput callback with the input line
			rl.prompt(); // prompts for the next input
		});

		console.log(helloMessage); // logs the helloMessage

		rl.prompt(); // prompts for the initial input

		this.#rl = rl;
	}

	// closes the readline interface
	close() {
		this.#rl.close();
	}
}
