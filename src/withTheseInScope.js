export default function withTheseInScope (items) {
	return (routine) => {
		routine.set(items);
	};
}
