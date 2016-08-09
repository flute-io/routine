export default function $usingThe (objectInScope) {
	return (methodToInvoke) => {
		return function usingThe (args) {
			const obj = this.routine.scope[objectInScope];

			if (!obj) {
				throw new Error(`Problem with a 'usingThe' operation: An ` + // eslint-disable-line quotes
					`object by the name of '${objectInScope}' does not exist in scope`);
			}

			const method = obj[methodToInvoke];

			if (!method) {
				throw new Error(`Problem with a 'usingThe' operation: A ` + // eslint-disable-line quotes
					`method with the name of '${methodToInvoke}' does not ` +
					`exist on the object named '${objectInScope}'`);
			}

			return this.routine.invoke({
				args,
				operation: method,
				scope: obj
			});
		};
	};
}

export const usingThe = $usingThe;
