export default class Routine {

	aborted = false;

	handlers = {};

	metadata = new Map();

	operations = [];

	isSynchronous = true;

	lastConditionMet = undefined;

	currentOperation = undefined;

	constructor (scope) {
		this.scope = scope || {};

		this.scope.routine = this;
	}

	addOperation (operation, instanceMetadata) {

		Routine.validateOperation(operation);

		if (instanceMetadata) {
			this.addOperationInstanceMetadata(operation, instanceMetadata);
		}

		this.operations.push(operation);

		return this;
	}

	addOperationInstanceMetadata (operation, instanceMetadata) {
		if (!this.metadata.has(operation)) {
			const metadata = {
				instance: {},
				static: {}
			};

			this.metadata.set(operation, metadata);
		}

		if (instanceMetadata) {
			if (typeof instanceMetadata !== 'object') {
				throw new Error('Instance metadata must be an object - Instance metadata was ' +
					`specified for an operation named ${operation.name} but the instance metadata was ` +
					`of type ${typeof operation}. Instance metadata must however be an object`);
			}

			this.metadata.get(operation).instance = instanceMetadata;
		}
	}

	first (operation, instanceMetadata) {
		this.addOperation(operation, instanceMetadata);
		return this;
	}

	then (operation, instanceMetadata) {
		this.addOperation(operation, instanceMetadata);
		return this;
	}

	otherwise (operation, instanceMetadata) {
		this.addOperationInstanceMetadata(operation, instanceMetadata);
		const _operation = (args) => {
			if (this.lastConditionMet) {
				this.abort();
			}
			else {
				return this.invoke({operation, args});
			}
		};

		this.addOperation(_operation);

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

	use (...decorators) {

		for (let decorator of decorators) {
			if (typeof decorator === 'function') {
				decorator(this);
			}
			else if(typeof decorator === 'object') {
				this.setScopeTo(decorator);
			}
		}

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

	invoke ({
		operation,
		args,
		isConstructor = false,
		hasMultipleArgs = false,
		respectAbort = true,
		recordIt = true,
		runHandlers = true,
		scope = this.scope
	} = {}) {

		const invocation = {
			operation,
			args,
			hasMultipleArgs,
			respectAbort,
			recordIt,
			runHandlers,
			scope
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
		else if (isConstructor) {
			if (invocation.hasMultipleArgs) {
				invocation.args.unshift(null);
				result = new (invocation.operation.bind.apply(invocation.operation, invocation.args));
			}
			else {
				result = new invocation.operation(invocation.args); // eslint-disable-line new-cap
			}
		}
		else {
			if (invocation.hasMultipleArgs) {
				result = invocation.operation.apply(invocation.scope, invocation.args);
			}
			else {
				result = invocation.operation.call(invocation.scope, invocation.args);
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

	setScopeTo (scope) {
		for (let prop in scope) {
			if (prop === '@routine.use') {
				this.use.apply(this, scope[prop]);
			}
			else if (prop !== 'routine' && scope.hasOwnProperty(prop)) {
				this.scope[prop] = scope[prop];
			}
		}
		return this;
	}

	static use (...decorators) {
		const routine = new Routine();
		routine.use.apply(routine, decorators);
		return routine;
	}

	static setScopeTo (scope) {
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
		routine.scope.error = error;

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
