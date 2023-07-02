import { stat } from 'fs/promises';
import { resolve } from 'path';
import { parsePathList } from '../utils/parse-path-list.js';

export class NavigationService {
	//  defining the init method that takes a stateService parameter
	init(stateService) {
		this.stateService = stateService; // assigning the stateService parameter to this.stateService
	}

	set cwd(path) {
		this.stateService.set('cwd', path); // setting the 'cwd' property in the stateService with the provided path
	}

	get cwd() {
		return this.stateService.get('cwd'); // returning the 'cwd' property from the stateService
	}

	upperDir() {
		return this.changeDir('..'); // calling the changeDir method with the argument '..' and returning its result
	}

	async changeDir(args) {
		const [relativePath] = parsePathList(args); // destructuring the first item from the array returned by the parsePathList function into relativePath

		const targetPath = resolve(this.cwd, relativePath); // resolving the targetPath by combining this.cwd (current working directory) and the relativePath

		try {
			const stats = await stat(targetPath); // awaiting the asynchronous result of calling the stat function on the targetPath
			if (stats.isDirectory()) this.cwd = targetPath; // checking if the targetPath corresponds to a directory, if so, updating the current working directory (this.cwd) to the targetPath
		} catch (error) {
			// catching any errors that occurred within the try block
			throw new Error('Operation failed');
		}
	}
}
