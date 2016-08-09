export default function $withTheseInScope (items) {
	return (routine) => {
		routine.setScopeTo(items);
	};
}

export const withTheseInScope = $withTheseInScope;
