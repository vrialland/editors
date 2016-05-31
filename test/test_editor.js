//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

var assert = require('assert');

var { createEditor,
      validators } = require('../editors');


const zeroValidator = function (input) {
    validators.toInt(input).isEqual(0, 'Nothing except 0 allowed');
    return input;
};


describe('Editor', function() {

  describe('Regular properties', function () {
      it('Initial empty editor', function () {
          var editor = createEditor();
          assert(editor.hasValidValue());
          assert.deepEqual({}, editor.serialize());

          editor.reset();
          assert(editor.hasValidValue());
          assert.deepEqual({}, editor.serialize());
      });
      it('Initial valid value', function () {
          var editor = createEditor({prop1: 42, prop2: 'dummy'});
          assert.equal(42, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize());

          editor.reset();
          assert.equal(42, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize());
      });
      it('Initial valid value / mustBeValid', function () {
          var editor = createEditor({prop1: 42, prop2: 'dummy'}, ['prop1']);
          assert.equal(42, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42}, editor.serialize());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize(false));

          editor.reset();

          assert.equal(42, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42}, editor.serialize());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize(false));
      });
      it('Initial valid value and invalid set value', function () {
          var editor = createEditor({prop1: 42, prop2: 'dummy'});
          editor.prop1.set(2, zeroValidator);
          assert.equal(42, editor.prop1.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize());

          editor.reset();
          assert.equal(42, editor.prop1.get());
          assert(editor.hasValidValue());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize());
      });
      it('Initial valid value and invalid set value / mustBeValid', function () {
          var editor = createEditor({prop1: 42, prop2: 'dummy'}, ['prop1']);
          editor.prop1.set(2, zeroValidator);
          assert.deepEqual({prop1: 42}, editor.serialize());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize(false));

          editor.reset();
          assert.deepEqual({prop1: 42}, editor.serialize());
          assert.deepEqual({prop1: 42, prop2: 'dummy'}, editor.serialize(false));
      });
      it('Initial invalid value', function () {
          var editor = createEditor({prop1: undefined, prop2: 'dummy', prop3: undefined});
          assert(!editor.hasValidValue());
          assert.deepEqual({prop2: 'dummy'}, editor.serialize());
          editor.reset();
          assert(!editor.hasValidValue());
          assert.deepEqual({prop2: 'dummy'}, editor.serialize());

          editor.prop1.set(0, zeroValidator);
          assert(!editor.hasValidValue());
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());
          editor.reset();
          assert(!editor.hasValidValue());
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());

          editor.prop3.set(0, zeroValidator);
          assert(editor.hasValidValue());
          assert.deepEqual({prop1:0, prop2: 'dummy', prop3: 0}, editor.serialize());

          editor.reset();
          assert(editor.hasValidValue());
          assert.equal(0, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert.equal(0, editor.prop3.get());
          assert.deepEqual({prop1:0, prop2: 'dummy', prop3: 0}, editor.serialize());
      });
      it('Initial invalid value / mustBeValid', function () {
          var editor = createEditor({prop1: undefined, prop2: 'dummy', prop3: undefined}, ['prop1', 'prop2']);
          assert(!editor.hasValidValue());
          assert.deepEqual({prop2: 'dummy'}, editor.serialize());
          editor.reset();
          assert(!editor.hasValidValue());
          assert.deepEqual({prop2: 'dummy'}, editor.serialize());

          editor.prop1.set(0, zeroValidator);
          assert(editor.hasValidValue());
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());
          editor.reset();
          assert(editor.hasValidValue());
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());

          editor.prop3.set(0, zeroValidator);
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());

          editor.reset();
          assert(editor.hasValidValue());
          assert.equal(0, editor.prop1.get());
          assert.equal('dummy', editor.prop2.get());
          assert.equal(0, editor.prop3.get());
          assert.deepEqual({prop1:0, prop2: 'dummy'}, editor.serialize());
      });
  });

  describe('Functions', function () {
      it('', function () {
          var fun1 = function () { return 24; },
              fun2 = function () { return this.prop1.get() },
              editor = createEditor({prop1: 42, fun1: fun1, fun2: fun2});
          assert.equal(fun1, editor.fun1);
          assert.equal(24, editor.fun1());
          assert.equal(fun2, editor.fun2);
          assert.equal(42, editor.fun2(), '``this`` inside the function works');
          assert(editor.hasValidValue());
          assert.deepEqual({prop1:42}, editor.serialize(), 'Functions are not serialized');

          editor.prop1.set(999);
          assert.equal(999, editor.fun2(), 'additional checks on ``this`` inside the function');

          editor.prop1.set(888, zeroValidator);
          assert.equal(999, editor.fun2(), 'additional checks on ``this`` inside the function');

          editor.reset();
          assert(editor.hasValidValue());
          assert.deepEqual({prop1:999}, editor.serialize());
      });
  });

  describe('Editors', function () {
      it('', function () {
          var editor1 = createEditor({prop1: 42}),
              editor2 = createEditor({ed1: editor1});
          assert.equal(editor1, editor2.ed1);
          // TODO hasValidValue, reset...
      });
  });

  describe('Validation', function() {
      it('', () => {
         var editor = createEditor({name: '', age: 0}),
             nameValidator = (v) => { validators.toString(v).required(); },
             ageValidator = (v) => { validators.toInt(v).greaterThan(18); };
         editor.name.set('John', nameValidator);
         editor.age.set(42, ageValidator);
         assert(editor.name.error == null, 'name has no error');
         assert(editor.age.error == null, 'age has no error');
         assert(Object.keys(editor.errors).length == 0, 'editor has no errors');

         editor.name.set('', nameValidator);
         editor.age.set(16, ageValidator);
         assert(editor.name.error != null, 'name has error');
         assert(editor.age.error != null, 'age has error');
         assert(Object.keys(editor.errors).length == 2, 'editor has 2 errors');
      });
  });
});
