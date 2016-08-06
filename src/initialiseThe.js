export default function operation (Constructor) {

	function initialiseThe (args) {
		return this.routine.invoke({
			args,
			operation: Constructor,
			isConstructor: true
		});
	}

	if (Constructor.name) {
		initialiseThe['@routine.metadata'] = {
			as: camelizedConstructorName(Constructor.name)
		};
	}

	return initialiseThe;
}

export const initialiseThe = operation;

function camelizedConstructorName (name) {
	return name.charAt(0).toLowerCase() + name.slice(1);
}
