/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';

describe('Routine.use(injector)', function () {

	it(' - should allow for auto-injecting operation arguments from the scope', function () {

		const state = {
			count: 0
		};

		Routine
			.use(injector)
			.setScopeTo({state})
			.then(addOneToStateCount)
			.run();

		expect(state).to.eql({count: 1});
	});

	it('should allow for specifying mappings that the injector ' +
		'can use to resolve dependencies', function () {

		const state = {
			count: 2,
			amount: 3
		};

		Routine
			.use(injector)
			.use(injector.mappings({
				amt: 'state.amount'
			}))
			.setScopeTo({state})
			.then(addAmountToCount)
			.run();

		expect(state).to.eql({count: 5, amount: 3});
	});
});

function addOneToStateCount (state) {
	state.count++;
}

function addAmountToCount (state, amt) {
	state.count = state.count + amt;
}
