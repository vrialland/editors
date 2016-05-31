//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const re_weburl = require('./regex-weburl');


class ValidationError extends Error {
    constructor(message='') {
        super(message);
        this.name = 'ValidationError';
    }
}


class Validator {
    constructor(input, trim=false, trimLeft=false, trimRight=false) {
        if (trim) {
            input = input.trim();
        }
        if (trimLeft) {
            input = input.trimLeft();
        }
        if (trimRight) {
            input = input.trimRight();
        }
        this.input = input;
    }

    get() {
        return this.input;
    }

    chain(...validators) {
        for (var validator of validators) {
            validator(this.input);
        }
        return this;
    }

    required(msg='Can\'t be empty') {
        if (!this.input) {
            throw new ValidationError(msg);
        }
        return this;
    }

    isEqual(value, msg=`Must equal ${value}`) {
        if (this.input != value) {
            throw new ValidationError(msg);
        }
        return this;
    }
}


class StringValidator extends Validator {
    minLength(limit, allowEqual=false, msg=`Value must be longer than ${limit} characters`) {
        var condition = allowEqual ? this.input.length >= limit : this.input.length > limit;
        if (!condition) {
            throw new ValidationError(msg);
        }
        return this;
    }

    maxLength(limit, allowEqual=false, msg=`Value exceeds ${limit} characters`) {
        var condition = allowEqual ? this.input.length <= limit : this.input.length < limit;
        if (!condition) {
            throw new ValidationError(msg);
        }
        return this;
    }

    match(re, msg=`Value must match ${re}`) {
        if (!re.test(this.input)) {
            throw new ValidationError(msg);
        }
        return this;
    }

    isLowerCase(msg='Must be lowercase') {
        if (this.input != this.input.toLowerCase()) {
            throw new ValidationError(msg);
        }
        return this;
    }

    isUpperCase(msg='Must be uppercase') {
        if (this.input != this.input.toUpperCase()) {
            throw new ValidationError(msg);
        }
        return this;
    }

    isDigit(msg='Must be numerical') {
        if (!/^[0-9]*[\.]{0,1}[0-9]*$/.test(this.input)) {
            throw new ValidationError(msg);
        }
        return this;
    }
};


class BaseNumericValidator extends Validator {
    greaterThan(value, msg=`Must be greater than ${value}`) {
        if (this.input <= value) {
            throw new ValidationError(msg);
        }
        return this;
    }

    greaterOrEqual(value, msg=`Must be greater or equal ${value}`) {
        if (this.input < value) {
            throw new ValidationError(msg);
        }
        return this;
    }

    lessThan(value, msg=`Must be less than ${value}`) {
        if (this.input >= value) {
            throw new ValidationError(msg);
        }
        return this;
    }

    lessOrEqual(value, msg=`Must be less or equal ${value}`) {
        if (this.input > value) {
            throw new ValidationError(msg);
        }
        return this;
    }
}


class IntValidator extends BaseNumericValidator {
    constructor(input, base=10, msg='Must be an integer') {
        input = parseInt(input, base);
        if (isNaN(input)) {
            throw new ValidationError(msg);
        }
        super(input);
    }
}


class FloatValidator extends BaseNumericValidator {
    constructor(input, msg='Must be a float') {
        input = parseFloat(input);
        if (isNaN(input)) {
            throw new ValidationError(msg);
        }
        super(input);
    }
}


class UrlValidator extends Validator {
    constructor(input, msg='Must be a valid url') {
        super(input, true);
        if (!re_weburl.test(this.input)) {
            throw new ValidationError(msg);
        }
    }
}


module.exports = {
    ValidationError: ValidationError,
    Validator: Validator,
    FloatValidator: FloatValidator,
    toFloat: (input, msg='Must be a float') => { return new FloatValidator(input, msg); },
    IntValidator: IntValidator,
    toInt: (input, base=10, msg='Must be an integer') => { return new IntValidator(input, base, msg); },
    StringValidator: StringValidator,
    toString: (input, trim=false, trimLeft=false, trimRight=false) => { return new StringValidator(input, trim, trimLeft, trimRight); },
    UrlValidator: UrlValidator,
    toUrl: (input, msg='Must be a valid URL') => { return new UrlValidator(input, msg); }
};
