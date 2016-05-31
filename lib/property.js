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
 * A property is a wrapper around a value. When one wants to set a new value (= input), an optional validator
 * is called against it and effectively changes the prop value, if validation succeeds, or store the input and the error if not.
 * A property can be initialized without a value, which makes the property "invalid" until a valid value is set.
 * Invalid properties will typically not be picked up by array properties or serialization of editors.
 * @see createProperty for constructor parameters documentation
 */
class Property {
    constructor(value, name) {
        this.value = value;     /* The last valid value of the property */
        this.name = name === undefined ? null : name;       /* A name for logs */
        this.input = value;     /* The last entered value, which may be invalid */
        this._error = this._initialError(value);  /* The last validation failure */
    }

    static get isProperty() {
        return true;
    }

    get isProperty() {
        return true;
    }

    static get INITIAL_ERROR_STATE() {
        return 'Initial error state';
    }

    _initialError(value) {
        return value === undefined ? this.INITIAL_ERROR_STATE : null;
    }

    /**
     * Returns the valid value of the property
     */
    get() {
        return this.value;
    }

    /**
     * Tries to set a new value into the property
     * @param {string} input New input value
     * @param {function} validator Function to validate the input against:
     *  - If validation succeeds, the function result is used to set our valid value
     *  - If an exception is thrown, only our ``input`` attribute changes and the ``error`` function will return the exception
     * @return {boolean} true on success
     */
    set(input, validator) {
        // console && console.log('[Prop] "' + this.name + '" updateValue with "' + input + '"');
        this.input = input;
        if (validator) {
            try {
                var value = validator(input);
                if (value === undefined) {
                    console && console.log('[Prop] "' + this.name + '" Warning: invalid validator (returned undefined); Not setting value');
                    return false;
                }
                this.value = value;
                this._error = this._initialError(this.value);
            } catch (e) {
                console && console.log('[Prop] "' + this.name + '" Validation failed with error: "' + e + '"');
                this._error = e.message;
                return false;
            }
        } else {
            // console.log('[Prop] No validation');
            this.value = input;
        }
        return true;
    }

    /**
     * Resets the property to the last valid value
     */
    reset() {
        // console && console.log('[Prop] "' + this.name + '" reset to "' + this.value + '"');
        this.input = this.value;
        this._error = this._initialError(this.value);
    }

    /**
     * Returns the last validation error of the property
     */
    get error() {
        return this._error;
    }

    /**
     * @return {boolean} true if the property contains a valid value
     * Warning: this is not the same as the ``error`` function, whose output you can compare to ``null`` to know
     * if the last ``set`` was successful.
     */
    hasValidValue() {
        return this.value !== undefined;
    };


    serialize() {
        return serialize(this.get());
    }
}


/**
 * Creates a new property.
 *
 * A property has:
 *  - a valid value, stored in ``value`` attribute (& always returned by ``get``)
 *  - the last input value, stored in ``input`` attribute
 *  - an error, returned by ``error``.
 * When setting a value using ``set``, you can pass a validator against which the input
 * will be validated; if validation succeeds, the result is used as the new valid value.
 *
 * @param {object} value If not specified, the property will start in error.
 * @param {string} name Optional property name.
 */
const createProperty = function (value, name) {
    return new Property(value, name);
};


module.exports = createProperty;
