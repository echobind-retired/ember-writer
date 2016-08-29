/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import {
  htmlSafe
} from 'ember-writer/helpers/html-safe';

import Ember from 'ember';
const { Handlebars } = Ember;
const { SafeString } = Handlebars;

describe('HtmlSafeHelper', function() {
  it('returns a SafeString', function() {
    let result = htmlSafe('<div>blah</div>');
    expect(result instanceof SafeString).to.be.ok;
  });
});
