export default function injector (routine) {

	routine.on('before-invoking-operation', (invocation) => {

		const argNames = $args(invocation.operation);
		const argsToInject = [];

		for (let argName of argNames) {
			if (argName === 'routine') {
				argsToInject.push(routine);
			}
			else if (routine.scope[argName]) {
				argsToInject.push(routine.scope[argName]);
			}
		}

		if (argsToInject.length === 1) {
			invocation.args = argsToInject[0];
		}
		else if (argsToInject.length > 1) {
			invocation.args = argsToInject;
			invocation.hasMultipleArgs = true;
		}
	});
}

function $args (func) {
	return (func + '')
		.replace(/[/][/].*$/mg, '') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
		.replace(/=[^,]+/g, '') // strip any ES6 defaults
		.split(',').filter(Boolean); // split & filter [""]
}
