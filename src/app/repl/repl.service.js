import { createInterface } from 'readline';

export class ReplService {
	#rl; // private field to store the readline interface

	constructor({ exit, input, output, prompt }) {
		this.#rl = createInterface({ input, output, prompt }); // creates a readline interface
		this.exit = exit; // sets the exit function
	}

	// initializes the ReplService with helloMessage, exitMessage, and handleInput callback
	init({ helloMessage, exitMessage, handleInput }) {
		// event handler for the 'close' event
		this.#rl.on('close', () => {
			console.log(exitMessage); // logs the exitMessage
			this.exit(); // calls the exit function
		});

		// event handler for the 'line' event
		this.#rl.on('line', (line) => {
			handleInput(line); // calls the handleInput callback with the input line
			this.#rl.prompt(); // prompts for the next input
		});

		console.log(helloMessage); // logs the helloMessage
		this.#rl.prompt(); // prompts for the initial input
	}

	// closes the readline interface
	close() {
		this.#rl.close();
	}
}
