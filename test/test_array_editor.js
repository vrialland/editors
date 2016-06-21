//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const assert = require('chai').assert;

const { createProperty,
        createArrayEditor } = require('../editors');


const zeroValidator = function (input) {
    if (input != 0) {
        throw 'Nothing except 0 allowed'
    }
    return input;
};


describe('ArrayEditor', function() {

    describe('No argument', function () {
        var editor = createArrayEditor();
        it('get(), value, serialize should return []', function () {
            assert.deepEqual([], editor.get());
            assert.deepEqual([], editor.value);
            assert.deepEqual([], editor.serialize());
        });
        it('error should return empty list', function () {
            assert.deepEqual([], editor.error);
        });
        it('hasValidValue() should return true', function () {
            assert(editor.hasValidValue());
        });
        it('reset() should keep initial value', function () {
            editor.reset();
            assert.deepEqual([], editor.get());
            assert.deepEqual([], editor.value);
            assert.deepEqual([], editor.serialize());
        });
    });

    describe('No argument, disabling empty arrays', function () {
        var editor = createArrayEditor(undefined, false);
        it('get(), value, serialize should return undefined', function () {
            assert.deepEqual(undefined, editor.get());
            assert.deepEqual(undefined, editor.value);
            assert.deepEqual(undefined, editor.serialize());
        });
        it('error should return empty list', function () {
            assert.deepEqual([], editor.error);
        });
        it('hasValidValue() should return false', function () {
            assert(!editor.hasValidValue());
        });
        it('reset() should keep initial undefined value', function () {
            editor.reset();
            assert.deepEqual(undefined, editor.get());
            assert.deepEqual(undefined, editor.value);
            assert.deepEqual(undefined, editor.serialize());
        });
    });

    describe('No properties', function () {
        var editor = createArrayEditor([1, 2, 3]);
        it('get(), value, serialize should return initial value', function () {
            assert.deepEqual([1, 2, 3], editor.get());
            assert.deepEqual([1, 2, 3], editor.value);
            assert.deepEqual([1, 2, 3], editor.serialize());
        });
        it('error should return undefined', function () {
            assert.deepEqual([undefined, undefined, undefined], editor.error);
        });
        it('hasValidValue() should return true', function () {
            assert(editor.hasValidValue());
        });
        it('reset() should keep initial value', function () {
            editor.reset();
            assert.deepEqual([1, 2, 3], editor.get());
            assert.deepEqual([1, 2, 3], editor.value);
            assert.deepEqual([1, 2, 3], editor.serialize());
        });
    });

    describe('Valid properties', function () {
        var prop1 = createProperty(42),
            prop2 = createProperty('dummy'),
            editor = createArrayEditor([prop1, prop2]);
        it('get(), value, serialize should return initial value', function () {
            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.equal(42, editor.get()[0].get());
            assert.equal('dummy', editor.get()[1].get());
            assert.deepEqual([42, 'dummy'], editor.serialize());
        });
        it('error should return undefined', function () {
            assert.deepEqual([undefined, undefined], editor.error);
        });
        it('hasValidValue() should return true', function () {
            assert(editor.hasValidValue());
        });
        it('reset() should keep initial value', function () {
            editor.reset();
            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.deepEqual([42, 'dummy'], editor.serialize());
        });
        it('setting invalid values should not change anything', function () {
            prop1.set(24, zeroValidator);
            assert.equal(42, prop1.get());
            assert.equal(24, prop1.input);
            assert.equal(24, editor.get()[0].input);
            assert.equal(42, editor.get()[0].get());

            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.deepEqual([42, 'dummy'], editor.serialize());

            editor.reset();

            assert.equal(42, prop1.get());
            assert.equal(42, prop1.input);
            assert.equal(42, editor.get()[0].input);
            assert.equal(42, editor.get()[0].get());

            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.deepEqual([42, 'dummy'], editor.serialize());
        });
    });

    describe('Invalid properties', function () {
        var prop1 = createProperty(42),
            prop2 = createProperty(),
            editor = createArrayEditor([prop1, prop2]);
        it('get(), value should return initial value', function () {
            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.equal(prop1, editor.get()[0]);
            assert.equal(prop2, editor.get()[1]);
            assert(!prop2.hasValidValue());
            assert(!editor.get()[1].hasValidValue());
            assert.equal(42, editor.get()[0].get());
            assert.equal(undefined, editor.get()[1].get());
        });
        it('serialize() should return valid values', function () {
            assert.deepEqual([42], editor.serialize());
        });
        it('error should return undefined and initial error', function () {
            assert.deepEqual([undefined, prop2.INITIAL_ERROR_STATE], editor.error);
        });
        it('hasValidValue() should return true since at least one item has a valid value', function () {
            assert(editor.hasValidValue());
        });
        it('reset() should keep only validated values', function () {
            editor.reset();
            assert.deepEqual([prop1], editor.get());
            assert.deepEqual([prop1], editor.value);
            assert.deepEqual([42], editor.serialize());
        });

        var prop3 = createProperty(),
            editor2 = createArrayEditor([prop3]);
        it('hasValidValue() should return false since no item has a valid value', function () {
            assert(!editor2.hasValidValue());
        });
        it('serialize() should return an empty array', function () {
            assert.deepEqual([], editor2.serialize());
        });
        it('reset() should keep only validated values', function () {
            editor2.reset();
            assert.deepEqual([], editor2.get());
            assert.deepEqual([], editor2.serialize());
        });
    });

    describe('Fixing invalid properties', function () {
        var prop1 = createProperty(42),
            prop2 = createProperty(),
            editor = createArrayEditor([prop1, prop2]);

        prop2.set(0, zeroValidator);

        it('error should return undefined', function () {
            assert.deepEqual([undefined, undefined], editor.error);
        });

        it('hasValidValue() should return true', function () {
            assert(editor.hasValidValue());
        });
        it('reset() should keep valid values', function () {
            editor.reset();
            assert.deepEqual([prop1, prop2], editor.get());
            assert.deepEqual([prop1, prop2], editor.value);
            assert.deepEqual([42, 0], editor.serialize());
        });
    });

    describe('Test isEditor', () => {
        assert(createArrayEditor([]).isEditor);
        assert(createArrayEditor([]).constructor.isEditor);
    });

});
