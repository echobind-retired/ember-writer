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
  'article-content',
  'Integration: ArticleContentComponent',
  {
    integration: true
  },
  function() {
    describe('content with pre & code tags', function() {
      beforeEach(function() {
        this.set('content', "<pre><code class='handlebars'>hello</code></pre>");
        this.render(hbs`{{article-content content=content}}`);
      });

      it('adds the highlightjs class', function() {
        let code = this.$('pre code');
        expect(code.hasClass('hljs')).to.be.ok;
      });
    });

    /*
      TODO: The below is left in to workaround a but in 2.8-beta.3. It works
      in canary (fixed in https://github.com/emberjs/ember.js/commit/447df33c4db30c475a08415196dbb7012f08cc07)

      Remove as soon as beta.4 is cut.
     */
    it('renders', function() {
      this.render(hbs`{{article-content}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
