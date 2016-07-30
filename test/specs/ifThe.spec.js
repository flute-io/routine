/* global describe, it, beforeEach*/

import ifThe from '../../src/ifThe';
import Routine from '../../src/Routine';
import {expect} from 'chai';
import {countIs, addOneToStateCount} from './../helpers';

describe('routine.then(ifThe(conditionIsMet)(doSomething))', function () {

	let state;

	beforeEach(function () {
		state = {
			count: 0
		};
	});

	it(' - should run the secondary operation only when the condition is met', function () {

		Routine
			.setScopeTo({state})
			.then(addOneToStateCount)
			.then(ifThe(countIs(1))(addOneToStateCount))
			.run();

		expect(state).to.eql({count: 2});
	});

	it(' - should not run the secondary operation when the condition is not met', function () {

		const state = {
			count: 0
		};

		Routine
			.setScopeTo({state})
			.then(addOneToStateCount)
			.then(ifThe(countIs(2))(addOneToStateCount))
			.then(addOneToStateCount)
			.run();

		expect(state).to.eql({count: 2});
	});

	it(' - should abort the routine if the condition is true and an `otherwise` ' +
		'directive has been specified ', function () {

		Routine
			.setScopeTo({state})
			.then(addOneToStateCount)
			.then(ifThe(countIs(1))(addOneToStateCount))
			.otherwise(addOneToStateCount)
			.run();

		expect(state).to.eql({count: 2});
	});

	it(' - should proceed with the routine if the condition is true and an `otherwise` ' +
		'directive has been specified ', function () {

		Routine
			.setScopeTo({state})
			.then(addOneToStateCount)
			.then(ifThe(countIs(1))(addOneToStateCount))
			.otherwise(addOneToStateCount)
			.run();

		expect(state).to.eql({count: 2});
	});
});
