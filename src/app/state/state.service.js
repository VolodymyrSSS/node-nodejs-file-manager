export class StateService {
	static #instance; // private static field to store the instance
	static #state = new Map(); // private static field to store the state as a Map

	constructor() {
		StateService.#instance ??= this; // assigns 'this' to #instance if it is currently null or undefined
		return StateService.#instance; // returns the instance to ensure only a single instance is created
	}

	// retrieves the value associated with the given key from the state
	get(key) {
		return StateService.#state.get(key);
	}

	// sets the value for the given key in the state
	set(key, value) {
		return StateService.#state.set(key, value);
	}

	// logs the state to the console
	show() {
		console.log(StateService.#state);
	}
}
