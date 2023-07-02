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

		navigationService.init(stateService); // retrieve the username from the stateService

		// define the echo function for logging colored text
		const echo = (args) => console.log(colorize('yellow', args.join(' ')));

		const commands = new Map([
			['.exit', () => replService.close()], // when the '.exit' command is executed, it will call the close function of the replService object. It's for closing the REPL (Read-Eval-Print Loop) service or the interactive command-line interface
			['echo', echo], // handler function for 'echo' command
			['kek', () => echo(['someone keked!'])], // when the 'kek' command is executed, it will invoke the echo function with the message 'someone keked!' as an argument
			['cwd', () => echo(navigationService.cwd)], // when the 'cwd' command is executed, it will invoke the echo function with the current working directory
			['up', () => navigationService.upperDir()], // when the 'up' command is executed, it will call the upperDir function of the navigationService object
			['cd', (args) => navigationService.changeDir(args.join(' '))], // when the 'cd' command is executed, it will call the changeDir function of the navigationService object, passing the joined arguments as the new directory path
			['ls', () => echo('executed ls!')], // when the 'ls' command is executed, it will invoke the echo function with the message 'executed ls!' as an argument
			['cat', () => echo('executed cat!')], // when the 'cat' command is executed, it will invoke the echo function with the message 'executed cat!' as an argument
			['add', () => echo('executed add!')], // when the 'add' command is executed, it will invoke the echo function with the message 'executed add!' as an argument
			['rn', () => echo('executed rn!')], //  when the 'rn' command is executed, it will invoke the echo function with the message 'executed rn!' as an argument
			['cp', () => echo('executed cp!')], // when the 'cp' command is executed, it will invoke the echo function with the message 'executed cp!' as an argument
			['mv', () => echo('executed mv!')], // when the 'mv' command is executed, it will invoke the echo function with the message 'executed mv!' as an argument
			['rm', () => echo('executed rm!')], // when the 'rm' command is executed, it will invoke the echo function with the message 'executed rm!' as an argument
			['os', () => echo('executed os!')], //  when the 'os' command is executed, it will invoke the echo function with the message 'executed os!' as an argument
			['hash', () => echo('executed hash!')], // when the 'hash' command is executed, it will invoke the echo function with the message 'executed hash!' as an argument
			['compress', () => echo('executed compress!')], // when the 'compress' command is executed, it will invoke the echo function with the message 'executed compress!' as an argument
			['decompress', () => echo('executed decompress!')], // when the 'decompress' command is executed, it will invoke the echo function with the message 'executed decompress!' as an argument
		]);

		// retrieve the username value
		const username = stateService.get('username') ?? 'Username';

		// retrieve the current working directory value
		const getCurrentCwd = () =>
			this.buildMessage(`You are currently in ${navigationService.cwd}`);

		const handleInput = async (input) => {
			if (!input) return; // if input is empty, return early
			const [command, ...args] = input.split(/\s+/); // split input into command  using a regular exp and arguments
			const handler = commands.get(command); // retrieve the handler function for the command
			try {
				if (handler)
					await handler(args); // checks if a valid handler function exists
				else throw new Error('Invalid input'); // if an error occurs during the execution
			} catch (error) {
				// if an error occurs during the execution
				console.error(colorize('red', error.message)); //  error message is logged to the console in red using the colorize function
			}
			console.log(getCurrentCwd()); // calls the getCurrentCwd function and logs its result to the console
		};

		// build the helloMessage with username
		let helloMessage = this.buildMessage(
			`Welcome to the File Manager, ${username}!`,
			username
		);
		// string interpolation to add a newline character (EOL) followed by the result of invoking the getCurrentCwd function
		helloMessage += `${EOL}${getCurrentCwd()}`; //

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
