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

		// initializes multiple service objects by calling their respective init methods, passing the stateService as a parameter for each service object in the array
		[navigationService, filesService, hashService, zipService].forEach(
			(service) => service.init(stateService)
		);

		// define the echo function for logging colored text
		const echo = (args) => console.log(colorize('yellow', args));

		const commands = new Map([
			['.exit', () => replService.close()], // when the '.exit' command is executed, it will call the close function of the replService object. It's for closing the REPL (Read-Eval-Print Loop) service or the interactive command-line interface
			['echo', echo], // handler function for 'echo' command
			['kek', () => echo('someone keked!')], // when the 'kek' command is executed, it will invoke the echo function with the message 'someone keked!' as an argument
			['cwd', () => echo(navigationService.cwd)], // when the 'cwd' command is executed, it will invoke the echo function with the current working directory
			['up', () => navigationService.upperDir()], // when the 'up' command is executed, it will call the upperDir function of the navigationService object
			['cd', (args) => navigationService.changeDir(args)], // when the 'cd' command is executed, it will call the changeDir function of the navigationService object, passing the joined arguments as the new directory path
			['ls', () => navigationService.list()], // when the 'ls' command is executed, it will call the list function of the navigationService object
			['cat', (args) => filesService.concatenate(args)], // command 'cat' with an associated handler function that invokes the concatenate method on the filesService object, passing the command arguments (args) as a parameter
			['add', (args) => filesService.addFile(args)], // command 'add' with an associated handler function that invokes the addFile method on the filesService object, passing the command arguments (args) as a parameter
			['rn', (args) => filesService.renameFile(args)], //  command 'rn' with an associated handler function that invokes the renameFile method on the filesService object, passing the command arguments (args) as a parameter
			['cp', (args) => filesService.copyFile(args)], // a command 'cp' with an associated handler function that invokes the copyFile method on the filesService object, passing the command arguments (args) as a parameter
			['mv', (args) => filesService.moveFile(args)], // command 'mv' with an associated handler function that invokes the moveFile method on the filesService object, passing the command arguments (args) as a parameter
			['rm', (args) => filesService.removeFile(args)], // command 'rm' with an associated handler function that invokes the removeFile method on the filesService object, passing the command arguments (args) as a parameter
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
			const trimmedInput = input.trim();
			if (!trimmedInput) return; // if trimmedInput is empty, return early
			const [command, ...args] = trimmedInput.split(' '); // split trimmedInput into command and arguments
			const handler = commands.get(command); // retrieve the handler function for the command
			try {
				// checks if a handler function exists and, if it does, calls it with the arguments joined together as a string with spaces and trimmed of any extra whitespace
				if (handler) await handler(args.join(' ').trim());
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
