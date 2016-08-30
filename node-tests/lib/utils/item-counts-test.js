/* jshint node: true */
'use strict';

const itemCounts = require('../../../lib/utils/item-counts');
const expect = require('chai').expect;

describe('itemCounts', function() {
  describe('with array', function() {
    let result;

    beforeEach(function() {
      let array = ['one', 'two', 'three', 'two', 'two', 'one'];
      result = itemCounts(array);
    });

    it('returns the counts in the result object', function() {
      expect(result.one).to.equal(2);
      expect(result.two).to.equal(3);
      expect(result.three).to.equal(1);
    });
  });
});
