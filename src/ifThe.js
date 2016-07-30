export default function operation (condition) {

	function runner (operation) {

		return function ifThe (args) {
			const shouldRun = this.routine.invoke({
				operation: condition,
				args
			});

			if (!(shouldRun instanceof Promise)) {
				this.routine.lastConditionMet = shouldRun;

				if (shouldRun) {
					return this.routine.invoke({operation});
				}
			}
		};
	}

	return runner;
}

export const ifThe = operation;

export class IfThe {
	constructor (condition) {
		this.condition = condition;
	}
}
