import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { parsePathList } from '../utils/parse-path-list.js';

export class HashService {
	// initializing the HashService with a stateService object
	init(stateService) {
		this.stateService = stateService; // assigning the 'stateService' object to 'this.stateService'
	}

	// getter method to get the current working directory from the stateService
	get cwd() {
		return this.stateService.get('cwd'); // returning the current working directory
	}

	// defining a 'hash' method
	hash(args) {
		return new Promise((res, rej) => {
			const hash = createHash('sha256'); // creating a hash object using the 'sha256' algorithm

			const [pathToFile] = parsePathList(args);
			const filePath = resolve(this.cwd, pathToFile); // resolving the file path based on the current working directory and the provided args

			const readStream = createReadStream(filePath); // creating a read stream for the file

			readStream.on('error', () => rej(new Error('Operation failed'))); // handling any error that occurs during reading the file
			readStream.on('data', (chunk) => hash.update(chunk)); // updating the hash with each chunk of data read from the file
			readStream.on('end', () => {
				console.log(hash.digest('hex')); // printing the hex-encoded hash digest to the console
				res(); // resolving the promise to indicate the completion of the hashing operation
			});
		});
	}
}
