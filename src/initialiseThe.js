export default function operation (Constructor) {
	return function initialiseThe (args) {
		return this.routine.invoke({
			args,
			operation: Constructor,
			isConstructor: true
		});
	};
}

export const initialiseThe = operation;
