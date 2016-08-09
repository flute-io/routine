export default function $injector (routine) {

	routine.on('invocation:before', (invocation) => {

		const metadata = routine.metadata.get(injector);
		const mappings = metadata ? metadata.mappings || {} : {};
		const argNames = $args(invocation.operation);
		const argsToInject = [];

		for (let argName of argNames) {
			if (argName === 'routine') {
				argsToInject.push(routine);
			}
			else if (mappings[argName]) {
				const arg = getItemFromObjByStringPath({
					obj: routine.scope,
					path: mappings[argName]
				});

				if (!arg) {
					// eslint-disable-next-line quotes
					throw new Error(`Injector mapping resolution error - mapping value ` +
						`of '${mappings[argName]}' for dependency named '${argName}' of operation ` +
						`named '${invocation.operation.name}' does not exist in scope`);
				}

				argsToInject.push(arg);
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

$injector.mappings = function (mappings) {
	return (routine) => {
		routine.metadata.set(injector, {mappings});
	};
};

export const injector = $injector;

function $args (func) {
	return (func + '')
		.replace(/[/][/].*$/mg, '') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
		.replace(/=[^,]+/g, '') // strip any ES6 defaults
		.split(',').filter(Boolean); // split & filter [""]
}

function getItemFromObjByStringPath ({obj, path} = {}) {
	const props = path.split('.');
	let item = obj;

	for (let prop of props) {
		item = item[prop];
		if (!item) {
			break;
		}
	}

	return item;
}
