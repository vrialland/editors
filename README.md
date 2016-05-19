[![Build Status](https://travis-ci.org/ygravrand/editors.svg?branch=master)](https://travis-ci.org/ygravrand/editors)

## Description

``editors`` is a set of classes useful when entering values in
fields and wanting to:
  - display & edit the potentially "wrong" value, run validators on change
  - reset to the last "right" value.


The following functions are available:
  - ``createProperty`` to create an individual "property", that is, a wrapper around a value
    with validation capabilities;
  - ``createEditor`` creating properties for you in a single object
  - ``createArrayEditor`` creating a special editor for arrays
  - ``serialize`` to serialize editors and properties' contents to simpler objects.

The module also exports a ``validators`` object with some frequently used validators.


## Example

Build the example with:

```
npm install
node_modules/.bin/webpack --debug --watch
```

And open ``example/index.html``

## Tests

Run the tests with:
```
npm test
```
