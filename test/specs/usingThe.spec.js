/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import usingThe from '../../src/usingThe';
import setupThe from '../../src/setupThe';
import memoriser from '../../src/memoriser';

describe('Routine.then(usingThe(`itemInScope`)(`doSomething`))', function () {

	it('should allow for invoking a method on an object that is in scope', function () {

		class State {
			count = 2;

			addValueToTheCount (value) {
				this.count = this.count + value;
			}
		}

		const state = Routine
			.use(injector)
			.use(memoriser)
			.then(setupThe(State), {as: 'state'})
			.then(getTheInitialCount, {as: 'value'})
			.then(usingThe('state')('addValueToTheCount'))
			.then(returnTheState)
			.run();

		expect(state).to.eql({count: 7});
	});

	it('should also work with a method that accepts multiple arguments', function () {

		class State {
			count = 2;

			addTwoValuesToTheCount (firstValue, secondValue) {
				this.count = this.count + firstValue + secondValue;
			}
		}

		const state = Routine
			.use(injector)
			.use(memoriser)
			.then(setupThe(State), {as: 'state'})
			.then(getTheInitialCount, {as: 'firstValue'})
			.then(getExtraAmount, {as: 'secondValue'})
			.then(usingThe('state')('addTwoValuesToTheCount'))
			.then(returnTheState)
			.run();

		expect(state).to.eql({count: 10});
	});

});

function getTheInitialCount () {
	return 5;
}

function getExtraAmount () {
	return 3;
}

function returnTheState (state) {
	return state;
}

