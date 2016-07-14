export default class Routine {

	aborted = false;

	actions = [];

	handlers = {};

	errorHandler = undefined;

	currentAction = undefined;

	static set (scope) {
		return new Routine(scope);
	}

	constructor (scope) {
		this.scope = scope;
	}

	addAction (action) {
		this.actions.push((arg)=> {
			if (!this.aborted) {
				this.currentAction = action;
				return action.call(this.scope, arg);
			}
		});
		return this;
	}

	first (action) {
		this.addAction(action);
		return this;
	}

	then (action) {
		this.addAction(action);
		return this;
	}

	onError (action) {
		this.errorHandler = action;
		return this;
	}

	on (eventName, action) {
		this.handlers[eventName] = action;
		return this;
	}

	get and () {
		return this;
	}

	get but () {
		return this;
	}

	run () {
		let lastResult;

		try {
			for (let i = 0; i < this.actions.length; i++) {
				let action = this.actions[i];
				lastResult = action(lastResult);

				if (lastResult instanceof Promise) {
					const actionsToPromisify = this.actions.slice(i + 1, this.actions.length);
					return runAsynchronously(this, actionsToPromisify, lastResult);
				}
			}

			return lastResult;
		}
		catch (error) {
			invokeErrorHandlerOn(this, error);
		}
	}
}

function runAsynchronously (routine, actions, lastResult) {
	let promise = Promise.resolve(lastResult);

	for (let action of actions) {
		promise = promise.then(action);
	}

	promise = promise.catch(error => {
		if (routine.handlers.error) {
			routine.aborted = true;
			setTimeout(()=> {
				invokeErrorHandlerOn(routine, error);
			});
		}
		else {
			return Promise.reject(error);
		}
	});

	return promise;
}

function invokeErrorHandlerOn (routine, error) {
	error.$state = routine.scope.state;
	error.$invocation = {
		action: routine.currentAction.name
	};

	if (routine.handlers.error) {
		routine.handlers.error(error);
	}
}
