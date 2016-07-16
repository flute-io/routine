/* global describe, it, beforeEach */

import Routine from '../../src/Routine';
import {expect, assert} from 'chai';

import {

	getState,
	addToCount,
	asynchronouslyAddToCount,
	asynchronouslyDoSomethingThatThrowsAnError,
	subtractFromCount,
	doSomethingThatThrowsAnError,
	doNothing

} from './../helpers';

describe('Routine', function () {

	let state;

	beforeEach(function () {
		state = getState();
	});

	it('should allow for setting up a routine that consists of ordered stateful function calls', function () {

		Routine
			.set({state})
			.then(addToCount(1))
			.then(addToCount(3))
			.then(subtractFromCount(1))
			.run();

		expect(state).to.eql({count: 3});
	});

	describe('promise support', function () {

		it('should also support functions that return promises alongside regular functions', function (done) {
			const promise = Routine
				.set({state})
				.then(addToCount(1))
				.then(addToCount(3))
				.then(asynchronouslyAddToCount(2))
				.then(subtractFromCount(1))
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
				.then(addToCount(1))
				.then(addToCount(3))
				.then(asynchronouslyAddToCount(2))
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
				.then(asynchronouslyAddToCount(2))
				.then(addToCount(1))
				.then(addToCount(3))
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
				.then(addToCount(1))
				.then(doSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
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
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(doSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
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
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
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
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					expect(error.$state).to.eql({count: 3});
					expect(error.$invocation).to.eql({
						operation: 'asynchronouslyDoSomethingThatThrowsAnError'
					});
					done();
				})
				.run()
				.catch(done);
		});

		it('should not report any native promise errors when an error handler ' +
			'has been used to catch an error that happened within a promise', function (done) {

			Routine
				.set({state})
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
				.but.on('error', doNothing)
				.run()
				.catch(error => {
					assert.fail(error, undefined, 'Error should not have been thrown');
				});

			Routine
				.set({state})
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
				.run()
				.catch(error => {
					expect(error).to.be.instanceOf(Error);
				});

			setTimeout(()=> {
				done();
			}, 500);
		});
	});

});
