export default class Routine {

	actions = [];

	lastResult = undefined;

	static set (scope) {
		return new Routine(scope);
	}

	constructor (scope) {
		this.scope = scope;
	}

	addAction (action) {
		this.actions.push(action);
	}

	first (action) {
		this.addAction(action);
		return this;
	}

	then (action) {
		this.addAction(action);
		return this;
	}

	run () {
		const scope = this.scope;
		let action, lastResult, i = 0;

		for (i; i < this.actions.length; i++) {

			action = this.actions[i];

			lastResult = action.call(this.scope, this.lastResult);

			if (lastResult instanceof Promise) {
				const promise = lastResult;
				const actionsToPromisify = this.actions.slice(i + 1, this.actions.length);

				promise.then(() => {
					return lastResult;
				});

				for (let action of actionsToPromisify) {
					promise.then((arg) => {
						return action.call(scope, arg);
					});
				}

				return promise;
			}
		}

		return lastResult;
	}
}
