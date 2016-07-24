/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import withTheseInScope from '../../src/withTheseInScope';

describe('Routine.use(withTheseInScope({some: `item`}))', function () {

	it('should allow for populating the scope with the properties of a routine', function () {

		const state = {
			count: 0
		};

		Routine
			.use(injector)
			.use(withTheseInScope({state}))
			.then(addOneToStateCount)
			.run();

		expect(state).to.eql({count: 1});
	});
});

function addOneToStateCount (state) {
	state.count++;
}
