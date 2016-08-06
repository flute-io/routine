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

	describe('basic usage', function () {

		it('should allow for setting up a routine that consists of ordered stateful function calls', function () {

			Routine
				.setScopeTo({state})
				.then(addToCount(1))
				.then(addToCount(3))
				.then(subtractFromCount(1))
				.run();

			expect(state).to.eql({count: 3});
		});

		it(' should throw an error whenever a routine is passed an undefined operation', function () {

			let errorThrown = false;

			try {
				Routine
					.setScopeTo({state})
					.then(addToCount(1))
					.then();
			}
			catch (error) {
				errorThrown = true;
			}

			expect(errorThrown).to.eql(true);
		});

		it('should not overwrite the routine in the scope when the scope is set', function () {

			const scope = {
				count: 0,
				routine: 3
			};

			const routine = Routine
				.setScopeTo(scope)
				.then(addToCount(1));

			expect(routine.scope.routine).to.equal(routine);

		});
	});

	describe('promise support', function () {

		it('should also support functions that return promises alongside regular functions', function (done) {
			const promise = Routine
				.setScopeTo({state})
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
				.setScopeTo({state})
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
				.setScopeTo({state})
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

		it('should throw an error whenever a synchrounous routine without an error handler fails', function () {
			let errorThrown = false;

			try {
				Routine
					.setScopeTo({state})
					.then(addToCount(1))
					.then(doSomethingThatThrowsAnError)
					.then(subtractFromCount(1))
					.run();
			}
			catch (error) {
				errorThrown = true;
			}

			expect(errorThrown).to.eql(true);
		});

		it('should support an on(`error`, ...) method that allows for setting up' +
			'an error handler', function () {

			Routine
				.setScopeTo({state})
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
				.setScopeTo({state})
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
				.setScopeTo({state})
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

		it('should append the invocation details to the error that is thrown', function (done) {

			Routine
				.setScopeTo({state})
				.then(addToCount(1))
				.then(asynchronouslyAddToCount(2))
				.then(asynchronouslyDoSomethingThatThrowsAnError)
				.then(subtractFromCount(1))
				.but.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
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
				.setScopeTo({state})
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
				.setScopeTo({state})
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

		it('should should add the error to the scope before invoking the error handler', function () {
			let error;

			Routine
				.setScopeTo({state})
				.then(addToCount(1))
				.then(doSomethingThatThrowsAnError)
				.but.on('error', function () {
					error = this.error;
				})
				.run();

			expect(error, 'error was not added to the scope').to.be.instanceOf(Error);
		});
	});

	describe(' - Routine.use(...)', function () {

		it(' - should add objects specified on the use method to the scope', function () {

			const state = {
				count: 1
			};

			const scope = {
				initialAmount: 3
			};

			const result = Routine
				.use(state, scope)
				.then(function () {
					return this.count + this.initialAmount;
				})
				.run();

			expect(result).to.eql(4);
		});
	});

});
