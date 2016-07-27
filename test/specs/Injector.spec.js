/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';

describe('Routine.use(injector)', function () {

	it('should allow for auto-injecting operation arguments from the scope', function () {

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
});

function addOneToStateCount (state) {
	state.count++;
}
