import { createInterface } from 'readline';
import { colorize } from '../utils/colorize.js';

export class ReplService {
	#rl; // private field to store the readline interface

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
		rl.on('line', async (line) => {
			await handleInput(line); // calls the handleInput callback with the input line
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
