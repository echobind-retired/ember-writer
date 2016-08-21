/* jshint node: true */
'use strict';

const Filter = require('broccoli-filter');

BlogMarkdownParser.prototype = Object.create(Filter.prototype);
BlogMarkdownParser.prototype.constructor = BlogMarkdownParser;
function BlogMarkdownParser(inputNode, options) {
  options = options || {};

  Filter.call(this, inputNode, {
    annotation: options.annotation
  });
}

BlogMarkdownParser.prototype.extensions = ['md'];
BlogMarkdownParser.prototype.targetExtension = 'md';

BlogMarkdownParser.prototype.processString = function(content, relativePath) {
  console.log(relativePath);
  // console.log(content);
  return content;
};

module.exports = BlogMarkdownParser;
