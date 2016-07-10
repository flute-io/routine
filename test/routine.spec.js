import Routine from '../lib/Routine';
import {expect} from 'chai';

describe('Routine', function () {

	let state;

	beforeEach(function () {
		state = {
			count: 0
		};
	});

	it('should allow for setting up a routine that consists of ordered stateful function calls', function () {

		Routine
			.set({state})
			.first(addOneToCount)
			.then(addThreeToCount)
			.then(subtractOneFromCount)
			.run();

		expect(state).to.eql({count: 3});
	});

	it('should also support functions that return promises alongside regular functions', function (done) {
		const promise = Routine
			.set({state})
			.first(addOneToCount)
			.then(addThreeToCount)
			.then(asynchronouslyAddTwoToCount)
			.then(subtractOneFromCount)
			.run();

		expect(promise).to.be.instanceOf(Promise);

		promise.then(()=> {
			expect(state).to.eql({count: 5});
		}).then(done);
	});

	it('should support promise returning function that has been specified as ' +
		'the last action of the routine ', function (done) {
		Routine
			.set({state})
			.first(addOneToCount)
			.then(addThreeToCount)
			.then(asynchronouslyAddTwoToCount)
			.run()
			.then(()=> {
				expect(state).to.eql({count: 6});
			})
			.then(done);
	});

	it('should support promise returning function that has been specified as ' +
		'the first action of the routine ', function (done) {
		Routine
			.set({state})
			.then(asynchronouslyAddTwoToCount)
			.then(addOneToCount)
			.then(addThreeToCount)
			.run()
			.then(()=> {
				expect(state).to.eql({count: 6});
			})
			.then(done);
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

function asynchronouslyAddTwoToCount () {
	const state = this.state;
	return Promise
		.resolve()
		.then(()=> {
			state.count = state.count + 2;
		});
}
