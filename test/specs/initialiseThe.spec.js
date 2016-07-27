/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import memoriser from '../../src/memoriser';
import initialiseThe from '../../src/initialiseThe';

describe('Routine.then(initialiseThe(Constructor))', function () {

	it('should allow for initialising a constructor that accepts a single argument ' +
		'that is in scope', function () {

		class State {
			constructor (count) {
				this.count = count || 0;
			}
		}

		const state = Routine
			.use(injector)
			.use(memoriser)
			.then(getTheInitialCount, {as: 'count'})
			.then(initialiseThe(State), {as: 'state'})
			.then(addOneToStateCount)
			.then(returnTheState)
			.run();

		expect(state).to.eql({count: 6});
	});

	it('should allow for initialising a constructor that accepts a multiple arguments ' +
		'that are in scope', function () {

		class State {
			count = 0;

			constructor (count, extra) {
				if (count && extra) {
					this.count = count + extra;
				}
			}
		}

		const state = Routine
			.use(injector)
			.use(memoriser)
			.then(getTheInitialCount, {as: 'count'})
			.then(getTheExtraAmount, {as: 'extra'})
			.then(initialiseThe(State), {as: 'state'})
			.then(addOneToStateCount)
			.then(returnTheState)
			.run();

		expect(state).to.eql({count: 8});
	});
});

function getTheInitialCount () {
	return 5;
}

function getTheExtraAmount () {
	return 2;
}

function addOneToStateCount (state) {
	state.count++;
}

function returnTheState (state) {
	return state;
}
