export default function operation (Constructor) {

	function setupThe (args) {
		return this.routine.invoke({
			args,
			operation: Constructor,
			isConstructor: true
		});
	}

	if (Constructor.name) {
		setupThe['@routine.metadata'] = {
			as: camelizedConstructorName(Constructor.name)
		};
	}

	return setupThe;
}

export const setupThe = operation;

function camelizedConstructorName (name) {
	return name.charAt(0).toLowerCase() + name.slice(1);
}
