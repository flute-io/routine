/* global describe, it, beforeEach */

import Routine from '../lib/Routine';
import {expect, assert} from 'chai';

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
			.then(addOneToCount)
			.then(addThreeToCount)
			.then(subtractOneFromCount)
			.run();

		expect(state).to.eql({count: 3});
	});

	describe('promise support', function () {

		it('should also support functions that return promises alongside regular functions', function (done) {
			const promise = Routine
				.set({state})
				.then(addOneToCount)
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
				.then(addOneToCount)
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

	describe('error handling', function () {

		it('should support an on(`error`, ...) method that allows for setting up' +
			'an error handler', function () {

			Routine
				.set({state})
				.then(addOneToCount)
				.then(doSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					expect(state).to.eql({count: 1});
				})
				.run();
		});

		it('(error handling) should also work for an asynchronous routine ' +
			'when error happens in a synchronous function', function (done) {

			Routine
				.set({state})
				.then(addOneToCount)
				.then(asynchronouslyAddTwoToCount)
				.then(doSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					expect(state).to.eql({count: 3});
					done();
				})
				.run();
		});

		it('should also catch errors that happen within promises', function (done) {

			Routine
				.set({state})
				.then(addOneToCount)
				.then(asynchronouslyAddTwoToCount)
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					expect(state).to.eql({count: 3});
					done();
				})
				.run();
		});

		it('should append the state and invocation details to the error that is thrown', function (done) {

			Routine
				.set({state})
				.then(addOneToCount)
				.then(asynchronouslyAddTwoToCount)
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					expect(error.$state).to.eql({count: 3});
					expect(error.$invocation).to.eql({
						action: 'asynchronouslyDoSomethingThatThrowsAnError'
					});
					done();
				})
				.run();
		});

		it('should not report any native promise errors when an error handler ' +
			'has been used to catch an error that happened within a promise', function (done) {

			Routine
				.set({state})
				.then(addOneToCount)
				.then(asynchronouslyAddTwoToCount)
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.but.on('error', doNothing)
				.run()
				.catch(error => {
					setTimeout(()=> {
						assert.fail(error, undefined, 'Error should not have been thrown');
					});
				});

			Routine
				.set({state})
				.then(addOneToCount)
				.then(asynchronouslyAddTwoToCount)
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractOneFromCount)
				.run()
				.catch(error => {
					setTimeout(()=> {
						expect(error).to.be.instanceOf(Error);
					});
				});

			setTimeout(()=> {
				done();
			}, 500);
		});
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

function asynchronouslyAddTwoToCount (args) {
	const state = this.state;
	return Promise
		.resolve()
		.then(()=> {
			state.count = state.count + 2;
		});
}

function doSomethingThatThrowsAnError () {
	throw new Error('something went wrong');
}

function asynchronouslyDoSomethingThatThrowsAnError (args) {
	return Promise
		.resolve()
		.then(() => {
			return Promise.reject(new Error('something went wrong asynchronously'));
		});
}

function doNothing () {

}
