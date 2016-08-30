/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it
} from 'mocha';
import {
  formatDate
} from 'ember-writer/helpers/format-date';
import moment from 'moment';
import config from 'ember-get-config';

describe('FormatDateHelper', function() {
  describe('with provided format', function() {
    let result;

    beforeEach(function() {
      let date = new Date('2016-10-31');
      let format = { format: 'MMMM' };
      result = formatDate([date], format);
    });

    it('formats the date using moment', function() {
      expect(result).to.equal('October');
    });
  });

  describe('with no format', function() {
    let result;
    let date;

    beforeEach(function() {
      date = new Date('2016-10-31');
      result = formatDate([date]);
    });

    it('falls back to the format in ENV', function() {
      let expectedFormat = moment(date).format(config.emberWriter.dateFormat);
      expect(result).to.equal(expectedFormat);
    });
  });
});
