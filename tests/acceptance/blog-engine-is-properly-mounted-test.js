/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: Blog engine is properly mounted', function() {
  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  describe('visiting /blog', function() {
    beforeEach(function() {
      visit('/blog');
    });

    it('shows a list of articles', function() {
      let posts = find('article');
      expect(posts).to.have.length(2);
    });

    it('only shows the post summary', function() {
      let article = find('article');
      expect(article.text().trim()).to.not.contain('-- THIS SHOULD NOT SHOW IN SUMMARY --');
    });
  });

  describe('view post detail', function() {
    beforeEach(function() {
      visit('/blog');
      click('.post-title a:contains(Mocha)');
    });

    it('shows the full body', function() {
      let article = find('article');
      expect(article.text().trim()).to.contain('-- THIS SHOULD NOT SHOW IN SUMMARY --');
    });

    it('has the proper URL', function() {
      expect(currentURL()).to.equal('/blog/another-test');
    });
  });

  describe('viewing authors', function() {
    beforeEach(function() {
      visit('/blog/authors');
    });

    it('shows a list of authors', function() {
      let authors = find('.author');
      expect(authors).to.have.length(2);
    });
  });
});
