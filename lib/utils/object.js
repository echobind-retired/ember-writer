/* jshint node: true */
'use strict';

const {
  assign
} = Object;

/**
 * Maps over the keys of an object converting the values of those keys into new
 * objects. The return value will be an object with the same set of
 * keys, but a different set of values. E.g.
 *
 * > mapObject({first: 1, second: 2}, (value)=> value *2)
 *
 *   {first: 2, second: 4}
 */
function mapObject(object = {}, fn) {
  return reduceObject(object, function(result, name, value) {
    return assign(result, { [name]: fn(name, value) });
  });
}

function reduceObject(object, fn, result = {}) {
  eachProperty(object, function(name, value) {
    result = fn(result, name, value);
  });
  return result;
}

function eachProperty(object, fn) {
  if (typeof object === 'object') {
    Object.keys(object).forEach(function(name) {
      fn(name, object[name]);
    });
  }
}

function values(object) {
  return reduceObject(object, function(result, name, value) {
    result.push(value);
    return result;
  }, []);
}

module.exports = {
  mapObject,
  reduceObject,
  eachProperty,
  values
};