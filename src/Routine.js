export {ensureThat} from './EnsureThat';

export default class Routine {

	aborted = false;

	operations = [];

	handlers = {};

	currentOperation = undefined;

	isSynchronous = true;

	aspects = {
		invocation: {
			before: [],
			after: []
		}
	};

	constructor (scope) {
		this.scope = scope;

		scope.routine = this;
	}

	addOperation (operation) {

		Routine.validateOperation(operation);

		this.operations.push(operation);

		return this;
	}

	first (operation) {
		this.addOperation(operation);
		return this;
	}

	then (operation) {
		this.addOperation(operation);
		return this;
	}

	on (eventName, operation) {
		Routine.validateOperation(operation);

		this.handlers[eventName] = (arg) => {
			return operation.call(this.scope, arg);
		};
		return this;
	}

	get setup () {
		return {
			as (...operations) {
				for (let operation of operations) {
					Routine.validateOperation(operation);
					this.invoke({
						operation,
						args: this,
						respectAbort: false,
						runAspects: false
					});
				}
			}
		};
	}

	get and () {
		return this;
	}

	get but () {
		return this;
	}

	abort () {
		this.aborted = true;
	}

	invoke ({operation, args, hasMultipleArgs = false, respectAbort = true, recordIt = true, runAspects = true} = {}) {

		if (runAspects) {
			for (let aspect of this.aspects.invocation.before) {
				aspect({operation, args, hasMultipleArgs, respectAbort, recordIt});
			}
		}

		if (respectAbort && this.aborted) {
			return;
		}

		if (recordIt) {
			this.currentOperation = operation;
		}

		let result;

		if (Routine.isRunnable(operation)) {
			result = operation.run(this);
		}
		else {
			if (hasMultipleArgs) {
				result = operation.apply(this.scope, args);
			}
			else {
				result = operation.call(this.scope, args);
			}
		}

		if (runAspects) {
			for (let aspect of this.aspects.invocation.after) {
				aspect({operation, args, hasMultipleArgs, respectAbort, recordIt, result});
			}
		}

		return result;
	}

	run () {
		let lastResult;

		try {
			for (let i = 0; i < this.operations.length; i++) {
				let operation = this.operations[i];

				lastResult = this.invoke({
					operation,
					args: lastResult
				});

				if (lastResult instanceof Promise) {
					this.isSynchronous = false;
					const operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
					return runAsynchronously(this, operationsToPromisify, lastResult);
				}
			}

			return lastResult;
		}
		catch (error) {
			Routine.handleError(this, error);
		}
	}

	static set (scope) {
		return new Routine(scope);
	}

	static isRunnable (operation) {
		return typeof operation === 'object' && operation.run !== undefined;
	}

	static validateOperation (operation) {
		if (!Routine.isRunnable(operation) && typeof operation !== 'function') {
			throw new Error('Invalid operation type - An operation has to ' +
				'either be a function or an object with a `run()` method. Instead an operation of type ' +
				`'${typeof operation}' was supplied.`);
		}
	}

	static handleError (routine, error) {
		error.$state = routine.scope.state;
		error.$invocation = {
			operation: routine.currentOperation.name
		};

		if (routine.handlers.error) {
			routine.invoke({
				operation: routine.handlers.error,
				args: error,
				recordIt: false,
				respectAbort: false
			});
		}
		else if (routine.isSynchronous) {
			throw error;
		}
	}
}

function runAsynchronously (routine, operations, lastResult) {
	let promise = Promise.resolve(lastResult);

	for (let operation of operations) {
		promise = promise.then((args)=> {
			return routine.invoke({
				operation,
				args
			});
		});
	}

	promise = promise.catch(error => {
		if (routine.handlers.error) {
			routine.abort();
			return new Promise(resolve => {
				Routine.handleError(routine, error);
				resolve();
			});
		}

		return Promise.reject(error);
	});

	return promise;
}
