//--
// Copyright (c) 2015-2016, Net-ng.
// All rights reserved.
//
// This software is licensed under the BSD License, as described in
// the LICENSE file, which you should have received as part of
// this distribution.
//--


const serialize = function (target) {

    if (target == null) {
        return null;

    } else if (Array.isArray(target)) {
        return target.map(function (elt, i) {
            return serialize(elt);
        });

    } else if (target.serialize) {
        return target.serialize();

    } else if (typeof target === 'function') {
        // pass

    } else {
        return target;
    }
};


module.exports = serialize;
