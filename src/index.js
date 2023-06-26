import { argv, chdir } from 'process'; // importing the argv and chdir functions from the process module
import readline from 'readline'; // importing the readline module for user input

let username = ''; // Define the username variable outside the startFileManager function

const startFileManager = () => {
	const args = argv.slice(2); // getting the command line arguments passed to the script
	const usernameArg = args.find((arg) => arg.startsWith('--username=')); // finding the argument that starts with '--username='

	if (usernameArg) {
		username = usernameArg.split('=')[1]; // extracting the value of the username from the argument
		console.log(`Welcome to the File Manager, ${username}!`); // displaying the welcome message with the username
	} else {
		console.log('Welcome to the File Manager!'); // displaying the default welcome message
	}

	const currentDirectory = process.cwd(); // getting the current working directory
	console.log('\nYou are currently in', currentDirectory); // displaying the current working directory

	const rl = readline.createInterface({
		input: process.stdin, // setting the input stream to standard input
		output: process.stdout, // setting the output stream to standard output
	});

	// registering the event handler for Ctrl+C
	rl.on('SIGINT', () => {
		console.log(`\nThank you for using File Manager, ${username}, goodbye!\n`); // displaying the exit message with the username
		rl.close();
		process.exit(); // exiting the process
	});

	const prompt = () => {
		rl.question('> ', (input) => {
			// prompting the user for input
			if (input === '.exit') {
				console.log(
					`\nThank you for using File Manager, ${username}, goodbye!\n`
				); // displaying the exit message with the username
				rl.close(); // closing the readline interface
				return; // exit the function to stop prompting
			}
			// Handle Ctrl+C input (SIGINT)
			if (input === null) {
				console.log(
					`\nThank you for using File Manager, ${username}, goodbye!\n`
				);
				process.exit();
				return;
			}
			prompt(); // recursive call to continue prompting for user input
		});
	};

	prompt(); // starting the prompting process
};

// to check the code I use cli: npm run start -- --username=Volodymyr

startFileManager(); // starting the file manager
