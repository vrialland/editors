//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const createProperty = require('./property');


/**
 * An Editor stores "properties" and functions.
 * Properties hold validated values and keep (temporary) non valid inputs.
 * The editor has a global "validated" status and provides ``reset`` and ``serialize`` functions
 * operating on properties.
 * @see createEditor for constructor parameters documentation
 */
function Editor (props, mustBeValid) {
    this.mustBeValid = mustBeValid || [];
    this.propNames = [];
    this.createProperties(props, mustBeValid);
}


Editor.prototype.isEditor = true;


Editor.prototype.createProperties = function (props, mustBeValid) {
    Object.keys(props).forEach(function (name) {
        var val = props[name];

        // When we pass functions in props, add them to the object prototype
        if (typeof val === 'function') {
            this[name] = val;

        // When we pass editors in props, add them directly without creating properties
        } else if (val && val.isEditor) {
            this[name] = val;
            if (!mustBeValid) { // Unless specified, all properties should be valid
                this.mustBeValid.push(name);
            }
            this.propNames.push(name);

        } else {
            this[name] = createProperty(val, name);
            if (!mustBeValid) {  // Unless specified, all properties should be valid
                this.mustBeValid.push(name);
            }
            this.propNames.push(name);
        }
    }, this);
};


/**
 * @return {boolean} true if the editor is considered as valid,
 * i.e. if all properties which must have a valid value have one indeed
 */
Editor.prototype.hasValidValue = function () {
    return this.mustBeValid.every(function (name) {
        return this[name].hasValidValue();
    }, this);
};


/**
 * Reset all properties to their last valid value if it exists
 */
Editor.prototype.reset = function () {
    this.propNames.forEach(function (name) {
        this[name].reset();
    }, this);
};


/**
 * Serialize properties to a value object
 * @param {boolean} onlyMustBeValid true (default) to serialize only properties which have to be valid
 * @return {object} value object with attributes: name -> serialized value
 */
Editor.prototype.serialize = function (onlyMustBeValid) {
    var res = {},
        propNames = (onlyMustBeValid || onlyMustBeValid === undefined) ? this.mustBeValid : this.propNames;
    propNames.forEach(function (name) {
        if (this[name].hasValidValue()) {
            var propVal = this[name].serialize();
            res[name] = propVal;
        }
    }, this);
    return res;
};


/**
 * Creates a new editor.
 * @param {object} props Object with attributes: name -> initial property value
 * (pass ``undefined`` to create an initial invalid value; Invalid properties will typically not be picked up by serialization or in arrays)
 * @param {array} mustBeValid Names of properties which must be valid to consider that the editor itself is valid (default: all created properties)
 */
const createEditor = function (props, mustBeValid) {
    return new Editor(props, mustBeValid);
};


module.exports = createEditor;
