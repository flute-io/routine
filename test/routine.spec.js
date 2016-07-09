import Routine from '../lib/Routine';
import {expect} from 'chai';

describe('Routine', function () {

	it('it should work', function () {
		expect(new Routine()).to.eql({hello: 'world'});
	});
});
