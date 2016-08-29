/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  describe,
  beforeEach
} from 'mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'article-info',
  'Integration: ArticleInfoComponent',
  {
    integration: true
  },
  function() {
    describe('article with author and date attributes', function() {
      beforeEach(function() {
        this.set('article', {
          attributes: {
            author: 'Dave',
            date: new Date('2015-06-22')
          }
        });

        this.render(hbs`{{article-info article=article}}`);
      });

      it('shows the author', function() {
        expect(this.$(`.author:contains(Dave)`)).to.have.length(1);
      });

      it('shows the date', function() {
        expect(this.$(`.date:contains(June)`)).to.have.length(1);
      });
    });

    /*
      TODO: The below is left in to workaround a but in 2.8-beta.3. It works
      in canary (fixed in https://github.com/emberjs/ember.js/commit/447df33c4db30c475a08415196dbb7012f08cc07)

      Remove as soon as beta.4 is cut.
     */
    it('renders', function() {
      this.render(hbs`{{article-info}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
