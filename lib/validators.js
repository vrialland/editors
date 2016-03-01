//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--

const maxLength = function (limit) {
    return function (input) {
        if (input.length > limit) {
            throw 'Too long';
        }
        return input;
    }
};


module.exports = {
    maxLength: maxLength
};
