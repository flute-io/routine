export function defaults (mapping) {

	return function defaults (routine) {

		routine.on('run:before', () => {

			const scope = routine.scope;

			for (let prop in mapping) {

				if (mapping.hasOwnProperty(prop)) {
					const def = definitionOf(scope, mapping, prop);
					def.host[def.property] = def.value;
				}
			}
		});
	};
}

function definitionOf (scope, mapping, prop) {

	const def = {
		host: '',
		property: '',
		value: ''
	};

	const parts = prop.split('.');

	if (parts.length === 1) {
		def.host = scope;
		def.property = prop;
		def.value = (()=> {
			return isDefined(scope[prop])
				? scope[prop]
				: mapping[prop];
		})();
	}
	else {

		const totalParts = parts.length;
		const idxOfLastPart = parts.length - 1;

		def.host = scope;

		for (let i = 0; i < totalParts; i++) {
			let part = parts[i];

			if (!isDefined(def.host[part]) && i < idxOfLastPart) {
				def.host[part] = {};
			}

			if (isDefined(def.host[part]) && typeof def.host[part] === 'object') {
				def.host = def.host[part];
			}

			if (i === idxOfLastPart) {
				def.property = part;
				def.value = (() => {
					return isDefined(def.host[part])
						? def.host[part]
						: mapping[prop];
				})();
			}
		}
	}

	return def;
}

function isDefined (value) {
	return value !== undefined
		&& value !== null;
}
