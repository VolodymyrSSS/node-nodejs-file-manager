import { resolve } from 'path';
import { parsePathList } from '../utils/parse-path-list.js';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';

export class ZipService {
	init(stateService) {
		this.stateService = stateService; // assigning the 'stateService' object to 'this.stateService'
	}

	// getter method to get the current working directory from the stateService.
	get cwd() {
		return this.stateService.get('cwd'); // returning the current working directory
	}

	compress(args) {
		return new Promise(async (res, rej) => {
			try {
				const [pathToFile, pathToDestination] = parsePathList(args); // parse the provided args to get the path to the file and the path to the destination
				const srcFilePath = resolve(this.cwd, pathToFile); // resolve the source file path based on the current working directory and the path to the file
				const destFilePath = resolve(this.cwd, pathToDestination); // resolve the destination file path based on the current working directory and the path to the destination
				const brotli = createBrotliCompress(); // create a new Brotli compression stream
				const readStream = createReadStream(srcFilePath); // create a read stream to read data from the source file
				const writeStream = createWriteStream(destFilePath, { flags: 'wx' }); // create a write stream to write compressed data to the destination file

				readStream.on('error', () => rej(new Error('Operation failed'))); // handle read stream error event
				writeStream.on('error', () => rej(new Error('Operation failed'))); // handle write stream error event
				writeStream.on('close', res); // handle write stream close event

				readStream.pipe(brotli).pipe(writeStream); // pipe the read stream through the Brotli compression stream and then into the write stream
			} catch {
				throw new Error('Operation failed'); // throw an error if any operation fails within the try block
			}
		});
	}

	decompress(args) {
		return new Promise(async (res, rej) => {
			try {
				const [pathToFile, pathToDestination] = parsePathList(args); // parse the provided args to get the path to the file and the path to the destination
				const srcFilePath = resolve(this.cwd, pathToFile); // resolve the source file path based on the current working directory and the path to the file
				const destFilePath = resolve(this.cwd, pathToDestination); // resolve the destination file path based on the current working directory and the path to the destination
				const brotli = createBrotliDecompress(); // create a new Brotli decompression stream
				const readStream = createReadStream(srcFilePath); // create a read stream to read data from the source file
				const writeStream = createWriteStream(destFilePath, { flags: 'wx' }); // create a write stream to write decompressed data to the destination file

				readStream.on('error', () => rej(new Error('Operation failed'))); // handle read stream error event
				writeStream.on('error', () => rej(new Error('Operation failed'))); // handle write stream error event
				writeStream.on('close', res); // handle write stream close event

				readStream.pipe(brotli).pipe(writeStream); // pipe the read stream through the Brotli decompression stream and then into the write stream
			} catch {
				throw new Error('Operation failed'); // throw an error if any operation fails within the try block
			}
		});
	}
}
