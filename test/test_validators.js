//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const assert = require('chai').assert,
      createEditor = require('../editors').createEditor;

const { ValidationError,
        Validator,
        FloatValidator,
        toFloat,
        IntValidator,
        toInt,
        StringValidator,
        toString,
        toUrl } = require('../editors').validators;


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

    it('Test isEqual', () => {
        assert.throws(() => { new Validator('hello').isEqual('bye'); }, /Must equal bye/, 'isEqual(bye) failed');
        assert.doesNotThrow(() => { new Validator('hello').isEqual('hello'); }, ValidationError);
    });
});

describe('Test StringValidator', function() {
    it ('Test function returns', () => {
        let v = toString('test');
        assert.equal(v, v.minLength(2));
        assert.equal(v, v.maxLength(10));
        assert.equal(v, v.match(/test/));
        assert.equal(v, v.isLowerCase());
        v.input = v.input.toUpperCase();
        assert.equal(v, v.isUpperCase());
        v.input = '123.4';
        assert.equal(v, v.isDigit());
    });

    it('Test min and max lengthes', () => {
        assert.throws(() => { toString('1234').minLength(10); }, /Value must be longer than 10 characters/, 'minLength(10) with 1234 failed');
        assert.doesNotThrow(() => { toString('1234').minLength(2); }, ValidationError, 'minLength(2) with 1234 failed');
        assert.throws(() => { toString('1234567890').minLength(10, false); }, /Value must be longer than 10 characters/, 'minLength(10, false) with 1234567890 failed');
        assert.doesNotThrow(() => { toString('1234567890').minLength(10, true); }, ValidationError, 'minLength(10, true) with 123457890 failed');

        assert.throws(() => { toString('1234567890').maxLength(10, false); }, /Value exceeds 10 characters/, 'maxLength(10, false) with 1234567890 failed');
        assert.doesNotThrow(() => { toString('1234').maxLength(10); }, ValidationError, 'maxLength(10) with 1234 failed');
        assert.doesNotThrow(() => { toString('1234567890').maxLength(10, true); }, ValidationError, 'maxLength(10, true) with 1234567890 failed');
        assert.throws(() => { toString('1234567890').maxLength(10, false); }, /Value exceeds 10 characters/, 'maxLength(10, false) with 1234567890 failed');
    });

    it('Test regex match', () => {
        assert.throws(() => { toString('1234567890').match(/01234/); }, /Value must match \/01234\//, 'match with /01234/ failed');
        assert.doesNotThrow(() => { toString('1234567890').match(/1234567890/); }, ValidationError, 'match with /1234567890/ failed');
    });

    it('Test case', () => {
        assert.throws(() => { toString('test').isUpperCase(); }, /Must be uppercase/, 'upper with test failed');
        assert.doesNotThrow(() => { toString('TEST').isUpperCase(); }, ValidationError);
        assert.throws(() => { toString('TEST').isLowerCase(); }, /Must be lowercase/, 'lower with TEST failed');
        assert.doesNotThrow(() => { toString('test').isLowerCase(); }, ValidationError);
        assert.throws(() => { toString('test').isDigit(); }, /Must be numerical/, 'digit with test failed');
        assert.throws(() => { toString('1.2.3').isDigit(); }, /Must be numerical/, 'digit with 1.2.3 failed');
        assert.doesNotThrow(() => { toString('123').isDigit(); }, ValidationError);
        assert.doesNotThrow(() => { toString('123.').isDigit(); }, ValidationError);
        assert.doesNotThrow(() => { toString('123.4').isDigit(); }, ValidationError);
        assert.doesNotThrow(() => { toString('.4').isDigit(); }, ValidationError);
    });
});


describe('Test IntValidator', function() {
    it('Test function returns', () => {
        let v = toInt(10);
        assert.equal(v, v.greaterThan(1));
        assert.equal(v, v.greaterOrEqual(1));
        assert.equal(v, v.lessThan(100));
        assert.equal(v, v.lessOrEqual(100));
    });

    it('Test constructor', () => {
        assert.throws(() => { toInt('test'); }, /Must be an integer/, 'constructor with test failed');
        assert.doesNotThrow(() => { toInt('10'); }, ValidationError);
        assert.doesNotThrow(() => { toInt(10); }, ValidationError);
        assert.doesNotThrow(() => { toInt(10.0); }, ValidationError);
        assert.equal(toInt('10').get(), 10);
        assert.equal(toInt('10.0').get(), 10);
        assert.equal(toInt(10).get(), 10);
        assert.equal(toInt(10.0).get(), 10);
    });

    it('Test greater', () => {
        assert.throws(() => { toInt(5).greaterThan(5); }, /Must be greater than 5/, 'greaterThan with 5 failed');
        assert.doesNotThrow(() => { toInt(5).greaterThan(2); }, ValidationError);
        assert.throws(() => { toInt(5).greaterOrEqual(6); }, /Must be greater or equal 6/, 'greaterOrEqual with 6 failed');
        assert.doesNotThrow(() => { toInt(5).greaterOrEqual(2); }, ValidationError);
        assert.doesNotThrow(() => { toInt(5).greaterOrEqual(5); }, ValidationError);
    });

    it('Test less', () => {
        assert.throws(() => { toInt(5).lessThan(2); }, /Must be less than 2/, 'lessThan with 2 failed');
        assert.doesNotThrow(() => { toInt(5).lessThan(10); }, ValidationError);
        assert.throws(() => { toInt(5).lessOrEqual(2); }, /Must be less or equal 2/, 'lessOrEqual with 6 failed');
        assert.doesNotThrow(() => { toInt(5).lessOrEqual(10); }, ValidationError);
        assert.doesNotThrow(() => { toInt(5).lessOrEqual(5); }, ValidationError);
    });
});

describe('Test FloatValidator', function() {
    it('Test function returns', () => {
        let v = toFloat(10.0);
        assert.equal(v, v.greaterThan(1.));
        assert.equal(v, v.greaterOrEqual(1.));
        assert.equal(v, v.lessThan(100.));
        assert.equal(v, v.lessOrEqual(100.));
    });

    it('Test constructor', () => {
        assert.throws(() => { toFloat('test'); }, /Must be a float/, 'constructor with test failed');
        assert.doesNotThrow(() => { toFloat('10'); }, ValidationError);
        assert.doesNotThrow(() => { toFloat(10); }, ValidationError);
        assert.doesNotThrow(() => { toFloat(10.0); }, ValidationError);
        assert.equal(toFloat('10').get(), 10.0);
        assert.equal(toFloat('10.0').get(), 10.0);
        assert.equal(toFloat(10).get(), 10.0);
        assert.equal(toFloat(10.0).get(), 10.0);
    });

    it('Test greater', () => {
        assert.throws(() => { toFloat(5).greaterThan(5.); }, /Must be greater than 5/, 'greaterThan with 5. failed');
        assert.doesNotThrow(() => { toFloat(5).greaterThan(2.); }, ValidationError);
        assert.throws(() => { toFloat(5).greaterOrEqual(6.); }, /Must be greater or equal 6/, 'greaterOrEqual with 6. failed');
        assert.doesNotThrow(() => { toFloat(5).greaterOrEqual(2.); }, ValidationError);
        assert.doesNotThrow(() => { toFloat(5).greaterOrEqual(5.); }, ValidationError);
    });

    it('Test less', () => {
        assert.throws(() => { toFloat(5).lessThan(2.); }, /Must be less than 2/, 'lessThan with 2. failed');
        assert.doesNotThrow(() => { toFloat(5).lessThan(10.); }, ValidationError);
        assert.throws(() => { toFloat(5).lessOrEqual(2.); }, /Must be less or equal 2/, 'lessOrEqual with 6. failed');
        assert.doesNotThrow(() => { toFloat(5).lessOrEqual(10.); }, ValidationError);
        assert.doesNotThrow(() => { toFloat(5).lessOrEqual(5.); }, ValidationError);
    });
});

describe('Test UrlValidator', function() {
    it('Test constructor', () => {
        var matches = [
            'http://foo.com/blah_blah',
            'http://foo.com/blah_blah/',
            'http://foo.com/blah_blah_(wikipedia)',
            'http://foo.com/blah_blah_(wikipedia)_(again)',
            'http://www.example.com/wpstyle/?p=364',
            'https://www.example.com/foo/?bar=baz&inga=42&quux',
            'http://✪df.ws/123',
            'http://userid:password@example.com:8080',
            'http://userid:password@example.com:8080/',
            'http://userid@example.com',
            'http://userid@example.com/',
            'http://userid@example.com:8080',
            'http://userid@example.com:8080/',
            'http://userid:password@example.com',
            'http://userid:password@example.com/',
            'http://142.42.1.1/',
            'http://142.42.1.1:8080/',
            'http://➡.ws/䨹',
            'http://⌘.ws',
            'http://⌘.ws/',
            'http://foo.com/blah_(wikipedia)#cite-1',
            'http://foo.com/blah_(wikipedia)_blah#cite-1',
            'http://foo.com/unicode_(✪)_in_parens',
            'http://foo.com/(something)?after=parens',
            'http://☺.damowmow.com/',
            'http://code.google.com/events/#&product=browser',
            'http://j.mp',
            'ftp://foo.bar/baz',
            'http://foo.bar/?q=Test%20URL-encoded%20stuff',
            'http://例子.测试',
            'http://उदाहरण.परीक्षा',
            'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com',
            'http://1337.net',
            'http://a.b-c.de',
            'http://223.255.255.254'
        ],
        no_matches = [
            'http://',
            'http://.',
            'http://..',
            'http://../',
            'http://?',
            'http://??',
            'http://??/',
            'http://#',
            'http://##',
            'http://##/',
            'http://foo.bar?q=Spaces should be encoded',
            '//',
            '//a',
            '///a',
            '///',
            'http:///a',
            'foo.com',
            'rdar://1234',
            'h://test',
            'http:// shouldfail.com',
            ':// should fail',
            'http://foo.bar/foo(bar)baz quux',
            'ftps://foo.bar/',
            'http://-error-.invalid/',
            'http://-a.b.co',
            'http://a.b-.co',
            'http://0.0.0.0',
            'http://10.1.1.0',
            'http://10.1.1.255',
            'http://224.1.1.1',
            'http://1.1.1.1.1',
            'http://123.123.123',
            'http://3628126748',
            'http://.www.foo.bar/',
            'http://.www.foo.bar./',
            'http://10.1.1.1'
        ];

        for (var url of matches) {
            assert.doesNotThrow(() => { toUrl(url); }, ValidationError, 'test with ' + url + ' failed');
        }

        for (var url of no_matches) {
            assert.throws(() => { toUrl(url); }, /Must be a valid URL/, 'test with ' + url + ' failed');
        }
    });
});

describe('Test validator chaining', () => {
    it('When all validators are OK', () => {
        var a = new StringValidator('hello').required(),
            b = (v) => { new StringValidator(v).isLowerCase(); },
            c = (v) => { new StringValidator(v).isEqual('hello'); };
        assert.equal('hello', a.chain(b, c), 'No validation error');
    });

    it('When first validator is wrong', () => {
        var a = (v) => { new StringValidator(v).isUpperCase() },
            b = (v) => { new StringValidator(v).required(); },
            c = (v) => { new StringValidator(v).isEqual('hello'); };
        assert.throws(() => { a('hello').chain(b, c); }, /Must be uppercase/, 'Chain with failure on 1st element failed');
    });

    it('When the other validator is wrong', () => {
        var a = new StringValidator('hello').required(),
            b = (v) => { new StringValidator(v).isUpperCase(); },
            c = (v) => { new StringValidator(v).isEqual('hello'); };
        assert.throws(() => { a.chain(b, c); }, /Must be uppercase/, 'Chain with failure on other element failed');
    });
});
