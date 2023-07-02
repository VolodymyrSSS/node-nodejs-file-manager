import { stat, readdir } from 'fs/promises';
import { isAbsolute, resolve } from 'path';
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
		const [pathToDirectory] = parsePathList(args);
		const isWin32 = this.stateService.get('platform') === 'win32'; // check if the platform is 'win32'
		const isWin32RootPath =
			pathToDirectory.includes(':') && !isAbsolute(pathToDirectory); // check if the pathToDirectory includes a ':' and is not an absolute path (e.g., 'C:\')
		const targetPath = resolve(
			isWin32 && isWin32RootPath ? '/' : this.cwd, // if it's a win32 platform and a root path, set the targetPath to '/'
			pathToDirectory // otherwise, set the targetPath to the current working directory (this.cwd) concatenated with the pathToDirectory
		);

		try {
			const stats = await stat(targetPath); // awaiting the asynchronous result of calling the stat function on the targetPath
			if (stats.isDirectory()) this.cwd = targetPath;
			// checking if the targetPath corresponds to a directory, if so, updating the current working directory (this.cwd) to the targetPath
			else throw new Error('Operation failed');
		} catch (error) {
			// catching any errors that occurred within the try block
			throw new Error('Operation failed');
		}
	}

	// defining an asynchronous list method
	async list() {
		// awaiting the result of the readdir function, which reads the contents of the current working directory (this.cwd) and returns an array of Dirent objects (file system entries)
		const dirents = await readdir(this.cwd, { withFileTypes: true });

		const list = dirents
			.map((dirent) => ({
				Name: dirent.name, // setting the Name property of the new object to the name of the dirent
				Type: dirent.isFile()
					? 'file'
					: dirent.isDirectory()
					? 'directory'
					: dirent.isSymbolicLink()
					? 'symbolic-link'
					: '', // setting the Type property of the new object based on the type of dirent, checking if it's a file, directory, symbolic link, or empty string
			})) // mapping over each dirent object and creating a new object with specific properties
			.sort(
				(a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)
			); // sorting the list array of objects first by Type and then by Name

		console.table(list); // displaying the list array of objects in tabular format in the console
	}
}
