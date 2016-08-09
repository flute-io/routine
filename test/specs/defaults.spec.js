/* global describe, it */

import {expect} from 'chai';
import Routine from '../../src/Routine';
import injector from '../../src/injector';
import defaults from '../../src/defaults';
import memoriser from '../../src/memoriser';

describe('Routine.use(defaults({...})', function () {

	it(' - should be used to specify default values for scope properties', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'amt': 2
				}),
				injector,
				memoriser
			]
		};

		const amt = Routine
			.use(scope)
			.then(getAmount)
			.run();

		expect(amt).to.eql(2);
	});

	it(' - should not return the default value if the value has already been set in the scope', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'amt': 2
				}),
				injector,
				memoriser
			],
			amt: 3
		};

		const amt = Routine
			.use(scope)
			.then(getAmount)
			.run();

		expect(amt).to.eql(3);
	});

	it(' - should not return the default amount, if it is later set', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'amt': 2
				}),
				injector,
				memoriser
			]
		};

		const amt = Routine
			.use(scope)
			.then(addOneToAmount, {as: 'newAmount'})
			.then(setAmountToFive)
			.then(addAmountToNewAmount)
			.run();

		expect(amt).to.eql(8);
	});

	it(' - should allow for setting the default of a nested property', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'some.other.amt': 2
				}),
				injector,
				memoriser
			]
		};

		const amt = Routine
			.use(scope)
			.then(getSomeOtherAmount)
			.run();

		expect(amt).to.eql(2);
	});

	it(' - should allow for overriding the default of a nested property', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'some.amt': 2
				}),
				injector,
				injector.mappings({
					someAmt: 'some.amt'
				}),
				memoriser
			]
		};

		const amt = Routine
			.use(scope)
			.then(addOneToSomeAmount, {as: 'newSomeAmt'})
			.then(setSomeAmountToFour)
			.then(addSomeAmountToNewSomeAmount)
			.run();

		expect(amt).to.eql(7);
	});

	it(' - should not overwrite nested prop value', function () {
		const scope = {
			'@routine.use': [
				defaults({
					'amt': 2,
					'initial.amt': 3,
					'some.other.amt': 4
				}),
				injector,
				injector.mappings({
					initialAmt: 'initial.amt',
					someOtherAmt: 'some.other.amt'
				}),
				memoriser
			],
			initial: {
				amt: 1
			}
		};

		const amt = Routine
			.use(scope)
			.then(addUpAllAmounts, {as: 'totalAmt'})
			.then(setSomeOtherAmtToOne)
			.then(addSomeOtherAmtToTotalAmt)
			.run();

		expect(amt).to.eql(8);
	});
});

function getAmount (amt) {
	return amt;
}

function addOneToAmount (amt) {
	return amt + 1;
}

function setAmountToFive () {
	this.amt = 5;
}

function addAmountToNewAmount (amt, newAmount) {
	return amt + newAmount;
}

function getSomeOtherAmount (some) {
	return some.other.amt;
}

function addOneToSomeAmount (someAmt) {
	return someAmt + 1;
}

function setSomeAmountToFour (some) {
	some.amt = 4;
}

function addSomeAmountToNewSomeAmount (someAmt, newSomeAmt) {

	return someAmt + newSomeAmt;
}

function addUpAllAmounts (amt, initialAmt, someOtherAmt) {
	return amt + initialAmt + someOtherAmt;
}

function setSomeOtherAmtToOne (some) {
	some.other.amt = 1;
}

function addSomeOtherAmtToTotalAmt (someOtherAmt, totalAmt) {
	return someOtherAmt + totalAmt;
}
