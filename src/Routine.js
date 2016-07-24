// export {ensureThat} from './EnsureThat'; // TODO: Uncomment or remove

export default class Routine {

	aborted = false;

	operations = [];

	handlers = {};

	currentOperation = undefined;

	isSynchronous = true;

	constructor (scope) {
		this.scope = scope || {};

		this.scope.routine = this;
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

		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}

		this.handlers[eventName].push((arg) => {
			return operation.call(this.scope, arg);
		});
		return this;
	}

	use (decorator) {
		decorator(this);
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

	invoke ({operation, args, hasMultipleArgs = false, respectAbort = true, recordIt = true, runHandlers = true} = {}) {

		const invocation = {
			operation,
			args,
			hasMultipleArgs,
			respectAbort,
			recordIt,
			runHandlers
		};

		if (invocation.runHandlers && this.handlers['before-invoking-operation']) {
			for (let handle of this.handlers['before-invoking-operation']) {
				handle(invocation);
			}
		}

		if (invocation.respectAbort && this.aborted) {
			return;
		}

		if (invocation.recordIt) {
			this.currentOperation = invocation.operation;
		}

		let result;

		if (Routine.isRunnable(invocation.operation)) {
			result = invocation.operation.run(this);
		}
		else {
			if (invocation.hasMultipleArgs) {
				result = invocation.operation.apply(this.scope, invocation.args);
			}
			else {
				result = invocation.operation.call(this.scope, invocation.args);
			}
		}

		if (runHandlers && this.handlers['after-invoking-operation']) {
			for (let aspect of this.handlers['after-invoking-operation']) {
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

	set (scope) {
		for (let prop in scope) {
			if (scope.hasOwnProperty(prop)) {
				this.scope[prop] = scope;
			}
		}
		return this;
	}

	static use (decorator) {
		const routine = new Routine();

		routine.use(decorator);

		return routine;
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
			operation: routine.currentOperation ? routine.currentOperation.name : 'unknown operation'
		};

		if (routine.handlers.error) {
			for (let operation of routine.handlers.error) {
				routine.invoke({
					operation: operation,
					args: error,
					recordIt: false,
					respectAbort: false
				});
			}
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
