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

      /*
        TODO: The below (and likely all integration tests) fail on beta, works in
        canary fixed in https://github.com/emberjs/ember.js/commit/447df33c4db30c475a08415196dbb7012f08cc07

        Re-enable as soon as beta.4 is cut.
       */
      it.skip('adds the highlightjs class', function() {
        let code = this.$('pre code');
        expect(code.hasClass('hljs')).to.be.ok;
      });
    });
  }
);
