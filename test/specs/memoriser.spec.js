/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import memoriser from '../../src/memoriser';
import withTheseInScope from '../../src/withTheseInScope';

describe('Routine.use(withTheseInScope({some: `item`}))', function () {

	it('should allow for populating the scope with the properties of a routine', function () {

		const state = {
			count: 0
		};

		Routine
			.use(injector)
			.use(memoriser)
			.use(withTheseInScope({state}))
			.then(getText, {as: 'text'})
			.then(addOneToStateCount)
			.then(setTextOnState)
			.run();

		expect(state).to.eql({count: 1, text: 'some text'});
	});

	it('should allow for memorising the result of an operation that returns a promise', function (done) {
		const state = {
			count: 0
		};

		Routine
			.use(injector)
			.use(memoriser)
			.use(withTheseInScope({state}))
			.then(getTextAsynchronously, {as: 'text'})
			.then(addOneToStateCount)
			.then(setTextOnState)
			.run()
			.then(() => {
				expect(state).to.eql({count: 1, text: 'some asynchronous text'});
			})
			.then(done)
			.catch(done);
	});
});

function getText () {
	return 'some text';
}

function getTextAsynchronously () {
	return Promise.resolve('some asynchronous text');
}

function addOneToStateCount (state) {
	state.count++;
}

function setTextOnState (text, state) {
	state.text = text;
}
