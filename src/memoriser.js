export default function memoriser (routine) {
	routine.on('after-invoking-operation', (invocation) => {

		const metadata = routine.metadata.get(invocation.operation);

		if (metadata && metadata.instance && metadata.instance.as) {
			if (invocation.result instanceof Promise) {
				invocation
					.result
					.then(result => {
						routine.scope[metadata.instance.as] = result;
					});
			}
			else {
				routine.scope[metadata.instance.as] = invocation.result;
			}
		}
	});
}
