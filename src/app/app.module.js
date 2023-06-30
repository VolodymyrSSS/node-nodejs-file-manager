import { parseProcessArgs } from './utils/parse-process-args.js';
import { homedir } from 'os';

export class App {
	constructor(
		process,
		AppController,
		{
			FilesService,
			HashService,
			NavigationService,
			OSService,
			ReplService,
			StateService,
			ZipService,
		}
	) {
		const args = parseProcessArgs(process); // parse the process arguments using the parseProcessArgs function
		const username = args.get('username') ?? 'Username'; // retrieve the username from the parsed arguments, or use a default value

		this.stateService = new StateService(); // create an instance of the StateService
		this.stateService.set('cwd', homedir()); // set the current working directory in the stateService
		this.stateService.set('username', username); // set the username in the stateService

		this.appController = new AppController(process, this.stateService, {
			// create an instance of the AppController with necessary dependencies
			replService: new ReplService(), // create an instance of the ReplService
			filesService: new FilesService(), // create an instance of the FilesService
			hashService: new HashService(), // create an instance of the HashService
			navigationService: new NavigationService(), // Create an instance of the NavigationService
			osService: new OSService(), // Create an instance of the OSService
			zipService: new ZipService(), // Create an instance of the ZipService
		});
	}

	run() {}
}
