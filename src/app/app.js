import { CommandService } from './command/command.service.js';
import { ReplService } from './repl/repl.service.js';
import { StateService } from './state/state.service.js';
import { colorize } from './utils/colorize.js';

import { colorize } from './utils/colorize.js';
import { parseProcessArgs } from './utils/parse-process-args.js';
import { EOL, homedir } from 'os';

export class App {
	#args; // private field to store the parsed process arguments

	constructor(process) {
		this.#args = parseProcessArgs(process);

		this.stateService = new StateService();
		this.stateService.set('cwd', homedir()); // sets the 'cwd' property to the user's home directory
		this.stateService.show(); // shows the state

		// process object represents the current Node.js process running for:
		const { exit, stdin, stdout } = process; // the process.exit method; standard input stream (allows to read input); standard output stream (allows to write output data)

		this.replService = new ReplService({
			exit,
			input: stdin,
			output: stdout,
			prompt: colorize('purple', '> '),
		}); // initializes the ReplService with necessary properties

		this.commandService = new CommandService(); // initializes the CommandService
	}

	// logs the program start message along with the #args values
	run() {
		console.log('Program starged with arguments:', this.#args);

		const username = this.#args.get('username') ?? 'Username'; // retrieves the username from #args

		this.initReplService(username, (input) => {
			try {
				this.commandService.handle(input.trim()); // tries to handle the input using the CommandService
			} catch (error) {
				console.error(colorize('red', error.message)); // logs the error message in red if an error occurs
				this.commandService.handle(); // continues to handle further commands
			}
		});
		this.initCommandService(() => this.replService.close());
	}

	initReplService(username, handleInput) {
		// creates the helloMessage
		const helloMessage = this.buildMessage(
			`Welcome to the File Manager, ${username}!`,
			username
		);
		// creates the exitMessage
		const exitMessage = this.buildMessage(
			`${EOL}Thank you for using File Manager, ${username}, goodbye!`,
			username
		);

		this.replService.init({ helloMessage, exitMessage, handleInput });
	}

	// initializes the CommandService
	initCommandService(close) {
		this.commandService.init(close);
	}

	// calling to create the helloMessage and exitMessage
	buildMessage(message, username) {
		const [cyan, green] = [colorize('cyan'), colorize('green')];
		return message.split(username).map(cyan).join(green(username));
	}
}
