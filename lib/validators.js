//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

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

    chain(validator) {
        // TODO
        return this;
    }

    required(msg='Can\'t be empty') {
        if (!this.input) {
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

    lowerCase(msg='Must be lowercase') {
        if (this.input != this.input.toLowerCase()) {
            throw new ValidationError(msg);
        }
        return this;
    }

    upperCase(msg='Must be uppercase') {
        if (this.input != this.input.toUpperCase()) {
            throw new ValidationError(msg);
        }
        return this;
    }

    digit(msg='Must be numerical') {
        if (!/^[0-9]*[\.]{0,1}[0-9]*$/.test(this.input)) {
            throw new ValidationError(msg);
        }
        return this;
    }
};


module.exports = {
    ValidationError: ValidationError,
    Validator: Validator,
    StringValidator: StringValidator
};
