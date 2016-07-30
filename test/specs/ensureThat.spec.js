/* global describe, it, beforeEach */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import {ensureThat} from '../../src/ensureThat';
import {

	getState,
	addToCount,
	countIs,
	setCountTo,
	asynchronouslyAddToCount,
	asyncCountIs

} from './../helpers';

describe('ensureThat(...)', function () {

	let state;

	beforeEach(function () {
		state = getState();
	});

	describe('when used in a synchronous routine', function () {

		it('should fail the routine when the conditional evaluates to false', function () {

			let errorOccurred = false;

			Routine
				.setScopeTo({state})
				.then(addToCount(1))
				.then(ensureThat(countIs(2)))
				.then(addToCount(1))
				.and.on('error', (error)=> {
					expect(error).to.be.instanceOf(Error);
					errorOccurred = true;
				})
				.run();

			expect(state).to.eql({count: 1});
			expect(errorOccurred).to.eql(true);
		});

		it('should allow the routine to run uninterrupted when the conditional evaluates to true', function () {

			let errorOccurred = false;

			Routine
				.setScopeTo({state})
				.then(addToCount(1))
				.then(ensureThat(countIs(1)))
				.then(addToCount(1))
				.and.on('error', ()=> {
					errorOccurred = true;
				})
				.run();

			expect(state).to.eql({count: 2});
			expect(errorOccurred).to.eql(false);
		});
	});

	describe('ensureThat(...).otherwise(...)', function (done) {

		describe('when used in a synchronous routine', function () {

			it('should abort the routine and run the operation specified in `otherwise`' +
				'while not throwing an error, when the conditional evaluates to false', function () {

				let errorWasThrown = false;

				Routine
					.setScopeTo({state})
					.then(addToCount(1))
					.then(ensureThat(countIs(2)).otherwise(setCountTo(10)))
					.then(addToCount(1))
					.and.on('error', ()=> {
						errorWasThrown = true;
					})
					.run();

				expect(state).to.eql({count: 10});
				expect(errorWasThrown).to.eql(false);
			});

			it('should cause the entire routine to run uninterrupted, ' +
				'when the conditional evaluates to true', function () {

				let errorWasThrown = false;

				Routine
					.setScopeTo({state})
					.then(addToCount(1))
					.then(ensureThat(countIs(1)).otherwise(setCountTo(10)))
					.then(addToCount(1))
					.and.on('error', ()=> {
						errorWasThrown = true;
					})
					.run();

				expect(state).to.eql({count: 2});
				expect(errorWasThrown).to.eql(false);
			});
		});

		describe('when used in an asynchronous routine', function () {

			it('should abort the routine and run the operation specified in `otherwise`' +
				'while not throwing an error, when the conditional evaluates to false', function (done) {

				let errorWasThrown = false;

				Routine
					.setScopeTo({state})
					.then(asynchronouslyAddToCount(2))
					.then(ensureThat(countIs(1)).otherwise(setCountTo(10)))
					.then(addToCount(1))
					.and.on('error', ()=> {
						errorWasThrown = true;
					})
					.run()
					.then(()=> {
						expect(state).to.eql({count: 10});
						expect(errorWasThrown).to.eql(false);
						done();
					})
					.catch(done);
			});

			it('should cause the entire routine to run uninterrupted ' +
				'when the conditional evaluates to true', function (done) {

				let errorWasThrown = false;

				Routine
					.setScopeTo({state})
					.then(asynchronouslyAddToCount(1))
					.then(ensureThat(countIs(1)).otherwise(setCountTo(10)))
					.then(addToCount(1))
					.and.on('error', ()=> {
						errorWasThrown = true;
					})
					.run()
					.then(()=> {
						expect(state).to.eql({count: 2});
						expect(errorWasThrown).to.eql(false);
						done();
					})
					.catch(done);
			});
		});
	});

	describe('ensureThat(...).that(...).and.that(...)', function () {

		describe('when running in an asynchronous routine', function () {

			it('should fail the routine at that point when any conditional evaluates to false', function (done) {

				let error;

				Routine
					.setScopeTo({state})
					.then(asynchronouslyAddToCount(1))
					.then(ensureThat(countIs(1)).that(countIs(2)).and.that(countIs(1)))
					.then(addToCount(1))
					.and.on('error', (_error)=> {
						error = _error;
					})
					.run()
					.then(()=> {
						expect(error).to.be.instanceOf(Error);
						expect(error.message).to.eql('Required condition of routine was ' +
							'not met -  countIs returned false');
						expect(state).to.eql({count: 1});
						done();
					})
					.catch(done);
			});

			it('should cause the routine to run uninterrupted when all the ' +
				'conditionals evaluate to true', function (done) {

				let errorOccurred = false;

				Routine
					.setScopeTo({state})
					.then(asynchronouslyAddToCount(1))
					.then(ensureThat(countIs(1)).that(countIs(1)).and.that(countIs(1)))
					.then(addToCount(1))
					.and.on('error', ()=> {
						errorOccurred = true;
					})
					.run()
					.then(()=> {
						expect(errorOccurred).to.eql(false);
						expect(state).to.eql({count: 2});
						done();
					})
					.catch(done);
			});

			describe('when one of the conditionals return a promise', function () {

				it('should fail when one of the conditionals return false', function (done) {
					let error;

					Routine
						.setScopeTo({state})
						.then(asynchronouslyAddToCount(1))
						.then(ensureThat(countIs(1)).that(asyncCountIs(2)).and.that(countIs(1)))
						.then(addToCount(1))
						.and.on('error', (_error)=> {
							error = _error;
						})
						.run()
						.then(()=> {
							expect(error).to.be.instanceOf(Error);
							expect(error.message).to.eql('Required condition of routine was ' +
								'not met -  asyncCountIs returned false');
							expect(state).to.eql({count: 1});
							done();
						})
						.catch(done);
				});

				it('should complete uninterrupted when one of the conditions return true', function (done) {
					let errorOccurred = false;

					Routine
						.setScopeTo({state})
						.then(asynchronouslyAddToCount(1))
						.then(ensureThat(countIs(1)).that(asyncCountIs(1)).and.that(countIs(1)))
						.then(addToCount(1))
						.and.on('error', ()=> {
							errorOccurred = true;
						})
						.run()
						.then(() => {
							expect(errorOccurred).to.eql(false);
							expect(state).to.eql({count: 2});
							done();
						})
						.catch(done);
				});
			});
		});
	});
});
