import { colorize } from './utils/colorize.js';
import { EOL } from 'os';

export class AppController {
	constructor(process, stateService, services) {
		const {
			replService,
			filesService,
			hashService,
			navigationService,
			osService,
			zipService,
		} = services; // destructure the services

		const username = stateService.get('username') ?? 'Username'; // retrieve the username from the stateService

		// define the echo function for logging colored text
		const echo = (...args) => console.log(colorize('yellow', args.join(' ')));

		const commands = new Map([
			['.exit', () => replService.close()], // handler function for '.exit' command
			['echo', echo], // handler function for 'echo' command
			['kek', () => echo('someone keked!')], // handler function for 'kek' command
			['cwd', () => echo(stateService.get('cwd'))], // handler function for 'cwd' command
		]);

		// define the map of commands and their corresponding handlers
		const handleInput = (input) => {
			if (!input) return; // if input is empty, return early
			const [command, ...args] = input.split(' '); // split input into command and arguments
			const handler = commands.get(command); // retrieve the handler function for the command
			if (handler)
				handler(...args); // if a handler is found, call it with the arguments
			else console.error(colorize('red', 'Invalid input')); // log an error message for invalid input
		};

		// build the helloMessage with username
		const helloMessage = this.buildMessage(
			`Welcome to the File Manager, ${username}!`,
			username
		);

		// build the exitMessage with username
		const exitMessage = this.buildMessage(
			`${EOL}Thank you for using File Manager, ${username}, goodbye!`,
			username
		);

		// initialize the replService with process, handleInput, helloMessage, and exitMessage
		replService.init({ process, handleInput, helloMessage, exitMessage });
	}

	// builds the message with username by applying colors
	buildMessage(message, username) {
		const [cyan, green] = [colorize('cyan'), colorize('green')];
		return message.split(username).map(cyan).join(green(username));
	}
}
