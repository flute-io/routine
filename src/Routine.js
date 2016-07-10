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
		let lastResult;

		for (let action of this.actions) {
			lastResult = action.call(this.scope, this.lastResult);
		}

		return lastResult;
	}
}
