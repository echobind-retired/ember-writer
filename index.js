/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const BlogMarkdownParser = require('./lib/blog-markdown-parser');

module.exports = {
  name: 'ember-static-blog',

  preprocessTree(type, tree) {
    var blogFiles = new Funnel(tree, {
      srcDir: 'dummy/blog'
    });

    var blogTree = new BlogMarkdownParser(blogFiles);

    return new MergeTrees([tree, blogTree]);
  },
};
