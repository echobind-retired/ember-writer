import Component from 'ember-component';
import layout from '../templates/components/article-content';

/* global require */
const Highlight = require('highlight.js');

export default Component.extend({
  layout,

  /**
   * The content for the article
   * @property
   * @type {String}
   * @default null
   * @public
   */
  content: null,

  didInsertElement() {
    this._super(...arguments);
    this._highlightCode();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this._highlightCode();
  },

  /**
   * Highlights component code blocks via HighlightJS.
   * @private
   */
  _highlightCode() {
    let code = this.$('pre code');

    code.each((i, block) => {
      Highlight.highlightBlock(block);
    });
  }
});
