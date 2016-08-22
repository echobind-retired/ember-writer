/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const BlogMarkdownParser = require('./lib/blog-markdown-parser');
const path = require('path');
const fs = require('fs-extra');
const _array = require('lodash/array');

module.exports = {
  name: 'ember-static-blog',

  included(app) {
    if (app.project.pkg['ember-addon'] && !app.project.pkg['ember-addon'].paths) {
      this.blogDirectory = path.resolve(app.project.root, path.join('tests', 'dummy', 'blog'));
    } else {
      this.blogDirectory = path.join(this.app.project.root, '/blog');
    }
  },

  treeForPublic(tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }

    let blogFiles = new Funnel(this.blogDirectory, {
      destDir: 'api/blog'
    });

    this.markdownParser = new BlogMarkdownParser(blogFiles);
    trees.push(this.markdownParser);

    return new MergeTrees(trees);
  },

  postBuild(result) {
    let blogPath = path.join(result.directory, 'api', 'blog');

    // blog index page
    // TODO: pagination
    fs.writeJsonSync(`${blogPath}/posts.json`, this.markdownParser.parsedPosts);

    // tags
    let counts = {};

    console.log(this.markdownParser.parsedPosts);
    let tags = this.markdownParser.parsedPosts.reduce((prev, post) => {
      let tags = post.attributes.tags.split(/,\s*/);
      return prev.concat(tags);
    }, []);


    tags.forEach((tag) => {
      let count = counts[tag] || 0;
      counts[tag] = count += 1;
    });

    let uniqueTags = _array.uniq(tags).map((tag) => {
      return {
        name: tag,
        count: counts[tag]
      };
    });

    fs.writeJsonSync(`${blogPath}/tags.json`, uniqueTags);

    // authors
    let authors = this.markdownParser.parsedPosts.reduce((prev, post) => {
      return prev.concat(post.attributes.author);
    }, []);

    fs.writeJsonSync(`${blogPath}/authors.json`, _array.uniq(authors));
  }
};
