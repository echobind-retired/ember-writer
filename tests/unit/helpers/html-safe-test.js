/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  htmlSafe
} from 'ember-writer/helpers/html-safe';

describe('HtmlSafeHelper', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = htmlSafe(42);
    expect(result).to.be.ok;
  });
});
