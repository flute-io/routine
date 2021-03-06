export default function $ensureThat (operation) {
	return new EnsureThat(operation);
}

export const ensureThat = $ensureThat;

export class EnsureThat {

	scope = {};

	operations = [];

	elseOperation = undefined;

	constructor (operation) {
		this.addOperation(operation);
	}

	addOperation (operation) {
		this.operations.push(operationPreppedForExecution(operation, this));
	}

	get and () {
		return this;
	}

	that (operation) {
		this.addOperation(operation);
		return this;
	}

	otherwise (operation) {
		this.elseOperation = operationPreppedForExecution(operation, this);
		return this;
	}

	run (routine, args) {
		this.routine = routine;

		for (let i = 0; i < this.operations.length; i++) {
			let operation = this.operations[i];
			let result = operation();

			if (result instanceof Promise) {
				const operationsToPromisify = this.operations.slice(i + 1, this.operations.length);
				return runAsynchronously(this, operationsToPromisify, result)
					.then(() => {
						return args;
					});
			}
			else {
				if (!result) {
					if (this.elseOperation) {
						this.elseOperation();
						this.routine.abort();
						return args;
					}
					else {
						throw conditionalErrorFor(routine);
					}
				}
			}
		}

		return args;
	}
}

function runAsynchronously (runner, _operations, lastResult) {
	let routine = runner.routine;
	let promise = lastResult;
	let operations = [promise].concat(_operations);

	for (let operation of operations) {
		promise = promise
			.then(operation)
			.then(result => {
				if (!result) {
					return Promise.reject(conditionalErrorFor(routine));
				}
			});
	}

	return promise;
}

function conditionalErrorFor (routine) {
	return new Error(`Required condition of routine was not met -  ${routine.currentOperation.name} returned false`);
}

function operationPreppedForExecution (operation, runnable) {
	return (args) => {
		return runnable.routine.invoke({operation, args});
	};
}
