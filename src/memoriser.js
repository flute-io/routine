export default function memoriser (routine) {
	routine.on('after-invoking-operation', (invocation) => {

		const metadata = routine.metadata.get(invocation.operation);

		if (metadata.instance.as) {
			routine.scope[metadata.instance.as] = invocation.result;
		}
	});
}
