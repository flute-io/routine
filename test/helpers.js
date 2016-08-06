export function getState () {
	return {
		count: 0
	};
}

export function addOneToStateCount () {
	this.state.count++;
}

export function addToCount (value) {
	return function addToCount () {
		this.state.count = this.state.count + value;
		return this.state.count;
	};
}

export function countIs (value) {
	return function countIs () {
		return this.state.count === value;
	};
}

export function asyncCountIs (value) {
	return function asyncCountIs () {
		return Promise
			.resolve()
			.then(() => {
				return this.state.count === value;
			});
	};
}

export function setCountTo (value) {
	return function setCountTo () {
		this.state.count = value;
	};
}

export function doSomethingThatThrowsAnError () {
	throw new Error('something went wrong');
}

export function asynchronouslyAddToCount (value) {
	return function asynchronouslyAddToCount () {
		return Promise
			.resolve()
			.then(() => {
				this.state.count = this.state.count + value;
			});
	};
}

export function asynchronouslyDoSomethingThatThrowsAnError (args) {
	return Promise
		.resolve()
		.then(() => {
			return Promise.reject(new Error('something went wrong asynchronously'));
		});
}

export function subtractFromCount (value) {
	return function subtractFromCount () {
		this.state.count = this.state.count - value;
	};
}

export function doNothing () {

}
