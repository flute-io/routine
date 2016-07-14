export {ensureThat} from './EnsureThat';

export default class Routine {

	aborted = false;

	operations = [];

	handlers = {};

	errorHandler = undefined;

	currentOperation = undefined;

	static set (scope) {
		return new Routine(scope);
	}

	constructor (scope) {
		this.scope = scope;

		scope.routine = this;
	}

	addOperation (operation) {

		let func;

		if (isRunnable(operation)) {
			func = () => {
				return operation.run(this);
			};
		}
		else {
			func = (arg) => {
				this.currentOperation = operation;
				return operation.call(this.scope, arg);
			};
		}

		this.operations.push((arg)=> {
			if (!this.aborted) {
				return func(arg);
			}
		});

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

	onError (operation) {
		this.errorHandler = operation;
		return this;
	}

	on (eventName, operation) {
		this.handlers[eventName] = operation;
		return this;
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

	run () {
		let lastResult;

		try {
			for (let i = 0; i < this.operations.length; i++) {
				let operation = this.operations[i];
				lastResult = operation(lastResult);

				if (lastResult instanceof Promise) {
					const operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
					return runAsynchronously(this, operationsToPromisify, lastResult);
				}
			}

			return lastResult;
		}
		catch (error) {
			invokeErrorHandlerOn(this, error);
		}
	}
}

function runAsynchronously (routine, operations, lastResult) {
	let promise = Promise.resolve(lastResult);

	for (let operation of operations) {
		promise = promise.then(operation);
	}

	promise = promise.catch(error => {
		if (routine.handlers.error) {
			routine.abort();
			return new Promise(resolve => {
				invokeErrorHandlerOn(routine, error);
				resolve();
			});
		}

		return Promise.reject(error);
	});

	return promise;
}

function invokeErrorHandlerOn (routine, error) {
	error.$state = routine.scope.state;
	error.$invocation = {
		operation: routine.currentOperation.name
	};

	if (routine.handlers.error) {
		routine.handlers.error(error);
	}
}

function isRunnable (operation) {
	return typeof operation === 'object' && operation.run !== undefined;
}
