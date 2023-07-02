export class OSService {
	init(stateService) {
		this.stateService = stateService; // assigning the 'stateService' object to 'this.stateService'
	}
	set cwd(path) {
		this.stateService.set('cwd', path); // setting the current working directory
	}
	get cwd() {
		return this.stateService.get('cwd'); // returning the current working directory
	}
	eol() {
		throw new Error('Not implemented'); // throwing an error indicating that the 'eol' method is not implemented
	}

	cpus() {
		throw new Error('Not implemented'); // throwing an error indicating that the 'cpus' method is not implemented
	}

	homedir() {
		throw new Error('Not implemented'); // throwing an error indicating that the 'homedir' method is not implemented
	}

	username() {
		throw new Error('Not implemented'); // throwing an error indicating that the 'username' method is not implemented
	}

	architecture() {
		throw new Error('Not implemented'); // throwing an error indicating that the 'architecture' method is not implemented
	}
}
