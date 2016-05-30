//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const assert = require('assert');

const { ValidationError,
        Validator,
        StringValidator } = require('../editors').validators;


describe('Test base validator', () => {
    it ('Test function returns', () => {
        let v = new Validator('test');
        assert.equal(v, v.required());
    });
    it('Test trim', () => {
        assert.equal(' test ', new Validator(' test ', false, false, false).get());
        assert.equal('test', new Validator(' test ', true, false, false).get());
        assert.equal('test ', new Validator(' test ', false, true, false).get());
        assert.equal(' test', new Validator(' test ', false, false, true).get());
        assert.equal('test', new Validator(' test ', false, true, true).get());
    });
    it('Test required', () => {
        assert.throws(() => { new Validator('').required(); }, /Can't be empty/, 'Empty string test failed');
        assert.throws(() => { new Validator(null).required(); }, /Can't be empty/, 'null test failed');
        assert.throws(() => { new Validator(undefined).required(); }, /Can't be empty/, 'undefined test failed');
        assert.throws(() => { new Validator('   ', true).required(); }, /Can't be empty/, 'Trimmed string test failed');
        assert.doesNotThrow(() => { new Validator('test').required(); }, ValidationError);
    });
});

describe('Test StringValidator', function() {
    it ('Test function returns', () => {
        let v = new StringValidator('test');
        assert.equal(v, v.minLength(2));
        assert.equal(v, v.maxLength(10));
        assert.equal(v, v.match(/test/));
        assert.equal(v, v.lowerCase());
        v.input = v.input.toUpperCase();
        assert.equal(v, v.upperCase());
        v.input = '123.4';
        assert.equal(v, v.digit());
    });
    it('Test min and max lengthes', () => {
        assert.throws(() => { new StringValidator('1234').minLength(10); }, /Value must be longer than 10 characters/, 'minLength(10) with 1234 failed');
        assert.doesNotThrow(() => { new StringValidator('1234').minLength(2); }, ValidationError, 'minLength(2) with 1234 failed');
        assert.throws(() => { new StringValidator('1234567890').minLength(10, false); }, /Value must be longer than 10 characters/, 'minLength(10, false) with 1234567890 failed');
        assert.doesNotThrow(() => { new StringValidator('1234567890').minLength(10, true); }, ValidationError, 'minLength(10, true) with 123457890 failed');

        assert.throws(() => { new StringValidator('1234567890').maxLength(10, false); }, /Value exceeds 10 characters/, 'maxLength(10, false) with 1234567890 failed');
        assert.doesNotThrow(() => { new StringValidator('1234').maxLength(10); }, ValidationError, 'maxLength(10) with 1234 failed');
        assert.doesNotThrow(() => { new StringValidator('1234567890').maxLength(10, true); }, ValidationError, 'maxLength(10, true) with 1234567890 failed');
        assert.throws(() => { new StringValidator('1234567890').maxLength(10, false); }, /Value exceeds 10 characters/, 'maxLength(10, false) with 1234567890 failed');
    });
    it('Test regex match', () => {
        assert.throws(() => { new StringValidator('1234567890').match(/01234/); }, /Value must match \/01234\//, 'match with /01234/ failed');
        assert.doesNotThrow(() => { new StringValidator('1234567890').match(/1234567890/); }, ValidationError, 'match with /1234567890/ failed');
    });
    it('Test case', () => {
        assert.throws(() => { new StringValidator('test').upperCase(); }, /Must be uppercase/, 'upper with test failed');
        assert.doesNotThrow(() => { new StringValidator('TEST').upperCase(); }, ValidationError);
        assert.throws(() => { new StringValidator('TEST').lowerCase(); }, /Must be lowercase/, 'lower with TEST failed');
        assert.doesNotThrow(() => { new StringValidator('test').lowerCase(); }, ValidationError);
        assert.throws(() => { new StringValidator('test').digit(); }, /Must be numerical/, 'digit with test failed');
        assert.throws(() => { new StringValidator('1.2.3').digit(); }, /Must be numerical/, 'digit with 1.2.3 failed');
        assert.doesNotThrow(() => { new StringValidator('123').digit(); }, ValidationError);
        assert.doesNotThrow(() => { new StringValidator('123.').digit(); }, ValidationError);
        assert.doesNotThrow(() => { new StringValidator('123.4').digit(); }, ValidationError);
        assert.doesNotThrow(() => { new StringValidator('.4').digit(); }, ValidationError);
    });
});
