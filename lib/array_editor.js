//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const serialize = require('./serializer');


/**
 * An ArrayEditor stores an array of values, which can in turn be properties, editors, ...
 * The editor has a global "validated" status and provides ``reset`` and ``serialize`` functions
 * operating on validated elements. This is used to reset lists to validated states, which can be
 * useful to remove temporary items in lists.
 * @see createArrayEditor for constructor parameters documentation
 */
function ArrayEditor (value) {
    this.value = value;
}


ArrayEditor.prototype.isEditor = true;

/**
 * @return {array} the array
 */
ArrayEditor.prototype.get = function () {
    return this.value;
};


/**
 * Sets a new value for the array
 * @param {array} value New value
 * @return {boolean} true if succeeded
 */
ArrayEditor.prototype.set = function (value) {
   this.value = value;
   return true;
};


/**
 * @return {array} Array of properties errors (for items which are in fact properties)
 * i.e [1, Property(2)] --> [undefined, 'Validation error']
 */
ArrayEditor.prototype.error = function () {
    if (this.value === undefined) {
        return [];
    }
    return this.value.map( function (elt) {
        if (elt.error === undefined) {
            return;
        }
        return elt.error();
    });
};


/**
 * Resets the ArrayEditor, i.e keep only valid items.
 * Items that have a ``hasValidValue`` (ex: properties, editors) method are kept if the method returns true.
 * Other items are kept no matter what.
 */
ArrayEditor.prototype.reset = function () {
    if (this.value === undefined) {
        return;
    }
    var newList = [];
    this.value.forEach(function (elt, i) {
        if (elt && elt.hasValidValue) {
            if (elt.hasValidValue()) {
                elt.reset();
                newList.push(elt);
            } else {
                console && console.log('[ArrayEditor Reset] Array element ' + i + ' is not valid, skipping it');
            }
        } else {
            newList.push(elt);
        }
    });
    this.value = newList;
};


/**
 * @return {boolean} true if at least one item in the array has a valid value
 */
ArrayEditor.prototype.hasValidValue = function () {
    if (this.value === undefined) {
        return false;
    }
    return this.value.some(function (elt) { return !elt.hasValidValue || elt.hasValidValue() });
};


/**
 * Serializes the ArrayEditor, keeping only valid items.
 * @return {object} value object with attributes: name -> serialized value
 */
ArrayEditor.prototype.serialize = function () {
    if (this.value === undefined) {
        return;
    }
    var res = [];
    this.value.forEach(function (elt, i) {
        if (!elt || !elt.hasValidValue || elt.hasValidValue()) {
            res.push(serialize(elt));
        }
    });
    return res;
};


/**
 * Creates a new array editor.
 * @param {array} value Initial array
 */
const createArrayEditor = function (value) {
    return new ArrayEditor(value);
}

module.exports = createArrayEditor;
