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

BlogMarkdownParser.prototype.processString = function(content, relativePath) {
  let parsed = frontMatter(content);
  let summary = summaryFromContent(parsed.body);
  parsed.summary = this.markdownConverter.makeHtml(summary);
  parsed.body = this.markdownConverter.makeHtml(parsed.body.replace('READMORE', ''));
  parsed.slug = parsed.attributes.slug || slugFromFilename(relativePath);

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
    if (filename) {
    filename = filename.replace(/\d{4}-\d{1,2}-\d{1,2}-/, 'posts/');
  }

  return filename;
};

function slugFromFilename(filename, extension='md') {
  let basename = path.basename(filename, `.${extension}`);
  return basename.replace(/\d{4}-\d{1,2}-\d{1,2}-/, '');
}

const DEFAULT_SUMMARY_LENGTH = 250;
function summaryFromContent(content) {
  return _summaryFromReadMore(content) || content.substring(0, 250);
}

function _summaryFromReadMore(content) {
  let readMoreIndex = content.indexOf('READMORE');
  return content.substring(0, readMoreIndex);
}

module.exports = BlogMarkdownParser;
