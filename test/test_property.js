//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

var assert = require('assert');

var { createProperty,
      validators } = require('../editors');


const zeroValidator = function (input) {
    validators.toInt(input).isEqual(0, 'Nothing except 0 allowed');
    return input;
};


describe('Property', function() {

  describe('Initial value to integer', function () {
      var prop = createProperty(-1, 'Initial value to integer');
      it('get(), value, input, serialize should return initial value', function () {
          assert.equal(-1, prop.get());
          assert.equal(-1, prop.value);
          assert.equal(-1, prop.input);
          assert.equal(-1, prop.serialize());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep initial value', function () {
          prop.reset();
          assert.equal(-1, prop.get());
          assert.equal(-1, prop.value);
          assert.equal(-1, prop.input);
          assert.equal(-1, prop.serialize());
      });
  });

  describe('Initial value to string', function () {
      var prop = createProperty('dummy', 'Initial value to string');
      it('get(), value, input, serialize should return initial value', function () {
          assert.equal('dummy', prop.get());
          assert.equal('dummy', prop.value);
          assert.equal('dummy', prop.input);
          assert.equal('dummy', prop.serialize());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep initial value', function () {
          prop.reset();
          assert.equal('dummy', prop.get());
          assert.equal('dummy', prop.value);
          assert.equal('dummy', prop.input);
          assert.equal('dummy', prop.serialize());
      });
  });

  describe('Initial value to array', function () {
      var prop = createProperty([1, 2, 3]);
      it('get(), value, input, serialize should return initial value', function () {
          assert.deepEqual([1, 2, 3], prop.get());
          assert.deepEqual([1, 2, 3], prop.value);
          assert.deepEqual([1, 2, 3], prop.input);
          assert.deepEqual([1, 2, 3], prop.serialize());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep initial value', function () {
          prop.reset();
          assert.deepEqual([1, 2, 3], prop.get());
          assert.deepEqual([1, 2, 3], prop.value);
          assert.deepEqual([1, 2, 3], prop.input);
          assert.deepEqual([1, 2, 3], prop.serialize());
      });
  });

  describe('Initial value to func', function () {
      var func = function () {return 'yay!'},
          prop = createProperty(func, 'Initial value to func');
      it('get(), value and input should return initial value', function () {
          assert.equal(func, prop.get());
          assert.equal(func, prop.value);
          assert.equal(func, prop.input);
          assert.equal('yay!', prop.get()());
          assert.equal('yay!', prop.input());
          assert.equal('yay!', prop.value());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('serialize() should skip it', function () {
          assert.equal(undefined, prop.serialize());
      });
      it('reset() should keep initial value', function () {
          prop.reset();
          assert.equal(func, prop.get());
          assert.equal(func, prop.value);
          assert.equal(func, prop.input);
          assert.equal('yay!', prop.get()());
          assert.equal('yay!', prop.input());
          assert.equal('yay!', prop.value());
      });
  });

  describe('Initial value to 0 or empty string or null', function () {
      var tests = [0, '', null];
      tests.forEach(function (test) {
          var prop = createProperty(test);
          it('get(), value, input, serialize should return initial value', function () {
              assert.equal(test, prop.get());
              assert.equal(test, prop.value);
              assert.equal(test, prop.input);
              assert.equal(test, prop.serialize());
          });
          it('error should return null', function () {
              assert.equal(null, prop.error);
          });
          it('hasValidValue() should return true', function () {
              assert(prop.hasValidValue());
          });
          it('reset() should keep initial value', function () {
              prop.reset();
              assert.equal(test, prop.get());
              assert.equal(test, prop.value);
              assert.equal(test, prop.input);
              assert.equal(test, prop.serialize());
          });
      });
  });

  describe('No initial value', function () {
      var prop = createProperty();
      it('get(), value, input, serialize should return undefined', function () {
          assert.equal(undefined, prop.get());
          assert.equal(undefined, prop.value);
          assert.equal(undefined, prop.input);
          assert.equal(undefined, prop.serialize());
      });
      it('error should return an error', function () {
          assert.equal(prop.INITIAL_ERROR_STATE, prop.error);
      });
      it('hasValidValue() should return false', function () {
          assert(!prop.hasValidValue());
      });
      it('reset() should keep (no) initial value', function () {
          prop.reset();
          assert.equal(undefined, prop.get());
          assert.equal(undefined, prop.value);
          assert.equal(undefined, prop.input);
          assert.equal(undefined, prop.serialize());
      });
  });

  describe('Initial value; setting a new value without validator', function () {
      var prop = createProperty(-1);
      prop.set(2);
      it('get(), value, input, serialize should return new value', function () {
          assert.equal(2, prop.get());
          assert.equal(2, prop.value);
          assert.equal(2, prop.input);
          assert.equal(2, prop.serialize());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep set value', function () {
          prop.reset();
          assert.equal(2, prop.get());
          assert.equal(2, prop.value);
          assert.equal(2, prop.input);
          assert.equal(2, prop.serialize());
      });
  });

  describe('Initial value; setting a new valid value', function () {
      var prop = createProperty(-1);
      prop.set(0, zeroValidator);
      it('get(), value, input, serialize should return new value', function () {
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.input);
          assert.equal(0, prop.serialize());
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep set value', function () {
          prop.reset();
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.input);
          assert.equal(0, prop.serialize());
      });
  });

  describe('Initial value; setting a new invalid value', function () {
      var prop = createProperty(0);
      prop.set(2, zeroValidator);
      it('get(), value, serialize should return old value', function () {
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.serialize());
      });
      it('input should return invalid value', function () {
          assert.equal(2, prop.input);
      });
      it('error should return error', function () {
          assert.equal('Nothing except 0 allowed', prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should restore valid value in input', function () {
          prop.reset();
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.input);
          assert.equal(0, prop.serialize());
      });
  });

  describe('No initial value; setting a new invalid value', function () {
      var prop = createProperty();
      prop.set(2, zeroValidator);
      it('get(), value, serialize should return old (invalid) value', function () {
          assert.equal(undefined, prop.get());
          assert.equal(undefined, prop.value);
          assert.equal(undefined, prop.serialize());
      });
      it('input should return invalid value', function () {
          assert.equal(2, prop.input);
      });
      it('error should return error', function () {
          assert.equal('Nothing except 0 allowed', prop.error);
      });
      it('hasValidValue() should return false', function () {
          assert(!prop.hasValidValue());
      });
      it('reset() should restore old (invalid) value in input', function () {
          prop.reset();
          assert.equal(undefined, prop.get());
          assert.equal(undefined, prop.value);
          assert.equal(undefined, prop.input);
          assert.equal(undefined, prop.serialize());
      });
  });

  describe('No initial value; setting a new valid value', function () {
      var prop = createProperty();
      prop.set(0, zeroValidator);
      it('get(), value, serialize should return valid value', function () {
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.serialize());
      });
      it('input should return valid value', function () {
          assert.equal(0, prop.input);
      });
      it('error should return null', function () {
          assert.equal(null, prop.error);
      });
      it('hasValidValue() should return true', function () {
          assert(prop.hasValidValue());
      });
      it('reset() should keep valid value', function () {
          prop.reset();
          assert.equal(0, prop.get());
          assert.equal(0, prop.value);
          assert.equal(0, prop.input);
          assert.equal(0, prop.serialize());
      });
  });
});
