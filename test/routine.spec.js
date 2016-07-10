import Routine from '../lib/Routine';
import {expect} from 'chai';

describe('Routine', function () {

	it('should allow for setting up a routine that consists of ordered stateful function calls', function () {

		const state = {
			count: 0
		};

		Routine
			.set({state})
			.first(addOneToCount)
			.then(addThreeToCount)
			.then(subtractOneFromCount)
			.run();

		expect(state).to.eql({count: 3});
	});
});

function addOneToCount () {
	this.state.count++;
}

function addThreeToCount () {
	this.state.count = this.state.count + 3;
}

function subtractOneFromCount () {
	this.state.count = this.state.count - 1;
}
