import { createReadStream, createWriteStream } from 'fs';
import { rename, rm, stat } from 'fs/promises';
import { basename, dirname, resolve } from 'path';
import { parsePathList } from '../utils/parse-path-list.js';

export class FilesService {
	init(stateService) {
		this.stateService = stateService; // initialize the stateService property with the provided stateService
	}

	get cwd() {
		return this.stateService.get('cwd'); // get the current working directory from the stateService
	}

	concatenate(args) {
		return new Promise((res, rej) => {
			const filePath = resolve(this.cwd, args); // resolve the file path based on the current working directory and the provided args
			const readStream = createReadStream(filePath); // create a readable stream from the file
			readStream.on('end', res); // resolve the promise when the stream ends
			readStream.on('error', () => rej(new Error('Operation failed'))); // reject the promise if there's an error reading the file
			readStream.pipe(process.stdout); // pipe the contents of the file to the standard output
		});
	}

	addFile(args) {
		return new Promise((res, rej) => {
			const filePath = resolve(this.cwd, args); // resolve the file path based on the current working directory and the provided args
			const writeStream = createWriteStream(filePath, { flags: 'wx' }); // create a writable stream to the file, with 'wx' flag to prevent overwriting existing file
			writeStream.on('close', res); // resolve the promise when the stream is closed
			writeStream.on('error', () => rej(new Error('Operation failed'))); // reject the promise if there's an error writing to the file
			writeStream.close(); // close the stream
		});
	}

	async renameFile(args) {
		try {
			const [pathToFile, newFileName] = parsePathList(args); // parse the provided args to get the path to the file and the new file name
			const srcFilePath = resolve(this.cwd, pathToFile); // resolve the source file path based on the current working directory and the path to the file
			const srcFileStats = await stat(srcFilePath); // get the stats of the source file
			const newFilePath = resolve(dirname(srcFilePath), newFileName); // resolve the new file path based on the directory of the source file and the new file name
			if (srcFileStats.isFile()) return await rename(srcFilePath, newFilePath); // if the source file is a regular file, rename it to the new file path
			throw new Error('Operation failed'); // throw an error if the operation fails
		} catch {
			throw new Error('Operation failed'); // throw an error if the operation fails
		}
	}

	copyFile(args) {
		return new Promise(async (res, rej) => {
			try {
				const [pathToFile, pathToNewDirectory] = parsePathList(args); // parse the provided args to get the path to the file and the path to the destination directory
				const srcFilePath = resolve(this.cwd, pathToFile); // resolve the source file path based on the current working directory and the path to the file
				const destDirPath = resolve(this.cwd, pathToNewDirectory); // resolve the destination directory path based on the current working directory and the path to the destination directory
				const srcFileStats = await stat(srcFilePath); // get the stats of the source file
				const destDirStats = await stat(destDirPath); // get the stats of the destination directory

				// check if both source and destination are valid (source is a file, destination is a directory)
				if (!(srcFileStats.isFile() && destDirStats.isDirectory()))
					rej(new Error('Operation failed')); // if not, reject the promise with an error
				const readStream = createReadStream(srcFilePath); // create a read stream to read the source file
				const writeStream = createWriteStream(
					resolve(destDirPath, basename(srcFilePath)), // resolve the full destination path by joining the destination directory and the base name of the source file
					{ flags: 'wx' } // set the write mode to 'wx' to open the file in exclusive mode
				); // create a write stream to write the source file to the destination directory

				// handle errors on the streams
				readStream.on('error', () => rej(new Error('Operation failed'))); // reject the promise if there is an error in the read stream
				writeStream.on('error', () => rej(new Error('Operation failed'))); // reject the promise if there is an error in the write stream
				writeStream.on('close', res); // resolve the promise when the write stream is closed successfully

				readStream.pipe(writeStream); // pipe the read stream into the write stream to perform the copy operation
			} catch (error) {
				rej(new Error('Operation failed')); // if any error occurs during the process, reject the promise with an error
			}
		});
	}

	// defining an asynchronous method 'moveFile' that takes 'args' as a parameter
	async moveFile(args) {
		try {
			await this.copyFile(args); // call the 'copyFile' method with the provided 'args' to copy the file
			await this.removeFile(args); // call the 'removeFile' method with the provided 'args' to remove the original file
		} catch {
			throw new Error('Operation failed'); // if any error occurs during the process, throw an error
		}
	}

	// defining an asynchronous method 'removeFile' that takes 'args' as a parameter
	async removeFile(args) {
		const [pathToFile] = parsePathList(args); // parse the 'args' using the 'parsePathList' function to get the path to the file to be removed
		const filePath = resolve(this.cwd, pathToFile); // resolving the file path using the current working directory and the 'pathToFile'
		try {
			return await rm(filePath); // using the 'rm' function from 'fs/promises' to remove the filePath
		} catch {
			throw new Error('Operation failed'); // if any error occurs during the process, throw an error
		}
	}
}
