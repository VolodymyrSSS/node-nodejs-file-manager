export class ZipService {
	init(stateService) {
		this.stateService = stateService; // assigning the 'stateService' object to 'this.stateService'
	}

	// setter method to set the current working directory in the stateService
	set cwd(path) {
		this.stateService.set('cwd', path); // setting the current working directory by calling the 'set' method on 'this.stateService'
	}

	// getter method to get the current working directory from the stateService.
	get cwd() {
		return this.stateService.get('cwd'); // returning the current working directory
	}

	compress(args) {
		throw new Error('Not implemented'); // throwing an error indicating that the 'compress' method is not implemented
	}

	decompress(args) {
		throw new Error('Not implemented'); // throwing an error indicating that the 'decompress' method is not implemented
	}
}
