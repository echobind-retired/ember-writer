/* jshint node: true */
'use strict';

const Filter = require('broccoli-filter');
const frontMatter = require('front-matter');
const showdown = require('showdown');
const path = require('path');

BlogMarkdownParser.prototype = Object.create(Filter.prototype);
BlogMarkdownParser.prototype.constructor = BlogMarkdownParser;
function BlogMarkdownParser(inputNode, options) {
  options = options || {};

  Filter.call(this, inputNode, {
    annotation: options.annotation,
    extensions: ['md'],
    targetExtension: 'json'
  });

  this.markdownConverter = new showdown.Converter();
  this.parsedPosts = [];
}

// BlogMarkdownParser.prototype.extensions = ['md'];

// TODO: this isn't working for some reason, so we replace manually below
// BlogMarkdownParser.prototype.targetExtension = 'json';

BlogMarkdownParser.prototype.processString = function(content, relativePath) {
  let parsed = frontMatter(content);
  let summary = summaryFromContent(parsed.body);
  parsed.summary = this.markdownConverter.makeHtml(summary);
  parsed.body = this.markdownConverter.makeHtml(parsed.body.replace('READMORE', ''));
  parsed.slug = parsed.attributes.slug || slugFromMarkdownFilename(relativePath);

  // replace existing posts with new content
  let existingPostIndex = this.parsedPosts.map((post) => post.slug).indexOf(parsed.slug);
  if (existingPostIndex >= 0) {
    this.parsedPosts.splice(existingPostIndex, 1, parsed);
  } else {
    this.parsedPosts.push(parsed);
  }

  return JSON.stringify(parsed);
};

BlogMarkdownParser.prototype.getDestFilePath = function(relativePath) {
  let filename = Filter.prototype.getDestFilePath.call(this, relativePath);

  // TODO: should we deal with data differently in process string above? it
  // would require turning js -> json (require + JSON.) OR
  // should we just have people put it top level as json

  return filename ? path.join('posts', filename) : null;
};

// TODO: util
function slugFromMarkdownFilename(filename) {
  let basename = path.basename(filename, '.md');
  return basename.replace(/\d{4}-\d{1,2}-\d{1,2}-/, '');
}

// TODO: util & configurable
const DEFAULT_SUMMARY_LENGTH = 250;
function summaryFromContent(content) {
  return _summaryFromReadMore(content) || content.substring(0, 250);
}

function _summaryFromReadMore(content) {
  let readMoreIndex = content.indexOf('READMORE');
  return content.substring(0, readMoreIndex);
}

module.exports = BlogMarkdownParser;
