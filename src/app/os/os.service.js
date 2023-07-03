import { EOL, arch, cpus, homedir, userInfo } from 'os'; // importing necessary functions and objects from the 'os' module
import { parseArgs } from '../utils/parse-args.js'; // importing the 'parseArgs' function from a custom module

//  providing various operating system-related services
export class OSService {
	commands = new Map([
		['--EOL', () => this.eol()], // mapping the '--EOL' argument to the 'eol' method
		['--cpus', () => this.cpus()], // mapping the '--cpus' argument to the 'cpus' method
		['--homedir', () => this.homedir()], // mapping the '--homedir' argument to the 'homedir' method
		['--username', () => this.username()], // mapping the '--username' argument to the 'username' method
		['--architecture', () => this.architecture()], // mapping the '--architecture' argument to the 'architecture' method
	]);

	os(args) {
		parseArgs(args).forEach((arg) => {
			const callback = this.commands.get(arg); // retrieve the callback function associated with the current argument
			if (callback) callback(); // if a valid callback is found, invoke it
		});
	}

	eol() {
		console.log(`Default system EOL: ${JSON.stringify(EOL)}`); // print the default system end-of-line characters
	}

	cpus() {
		const cpuList = cpus().map((cpu) => ({
			Model: cpu.model.trim(),
			'Clock rate (GHz)': cpu.speed / 1000,
		})); // retrieve CPU information and create an array of objects containing the model and clock rate
		console.log(`Overall amount of CPUS: ${cpuList.length}`); // print the overall number of CPUs
		console.table(cpuList); // print the table representation of the CPU information
	}

	homedir() {
		console.log(`Home directory: ${homedir()}`); // print the path of the user's home directory
	}

	username() {
		console.log(`System User Name: ${userInfo().username}`); // print the system user name
	}

	architecture() {
		console.log(`CPU architecture: ${arch()}`); // print the CPU architecture
	}
}
