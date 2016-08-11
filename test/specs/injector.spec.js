/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import {doSomethingThatThrowsAnError} from '../helpers';

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

	it(' - should allow for specifying mappings that the injector ' +
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

	it(' - should inject the error handler', function () {

		const state = {
			count: 2
		};

		Routine
			.use(injector)
			.setScopeTo({state})
			.then(doSomethingThatThrowsAnError)
			.and.on('error', function (error, state) { // eslint-disable-line  handle-callback-err
				state.count++;
			})
			.run();

		expect(state).to.eql({count: 3});
	});

	it(' - should supply the default args for dependencies that have not been found', function () {

		const scope = {
			firstValue: 1,
			secondValue: 2,
			thirdValue: 3
		};

		const result = Routine
			.use(injector)
			.use(scope)
			.then(getTheValueTen)
			.then(function (thirdValue, value, secondValue, firstValue) {
				return firstValue + value + secondValue + thirdValue;
			})
			.run();

		expect(result).to.eql(16);
	});
});

function getTheValueTen () {
	return 10;
}

function addOneToStateCount (state) {
	state.count++;
}

function addAmountToCount (state, amt) {
	state.count = state.count + amt;
}
