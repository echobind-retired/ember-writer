/* jshint node: true */
'use strict';

/**
 * Returns an object where array elements are keys, and the number of times
 * the element appears in the array is the value.
 *
 * @param  {Array} array The array to count elements on
 * @return {[type]} An object with counts
 * @public
 */
function itemCounts(array=[]) {
  let counts = {};

  array.forEach((thing) => {
    let count = counts[thing] || 0;
    counts[thing] = count += 1;
  });

  return counts;
}

module.exports = itemCounts;
