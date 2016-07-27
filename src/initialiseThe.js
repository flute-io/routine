export default function initialiseThe (Constructor) {
	return function initialiseThe (args) {
		return this.routine.invoke({
			args,
			operation: Constructor,
			isConstructor: true
		});
	};
}
