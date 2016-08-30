/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const BlogMarkdownParser = require('./lib/blog-markdown-parser');
const path = require('path');
const fs = require('fs-extra');
const _array = require('lodash/array');
const _string = require('lodash/string');

module.exports = {
  name: 'ember-writer',

  included(app) {
    if (app.project.pkg['ember-addon'] && !app.project.pkg['ember-addon'].paths) {
      this.blogDirectory = path.resolve(app.project.root, path.join('tests', 'dummy', 'blog'));
    } else {
      this.blogDirectory = path.join(this.app.project.root, '/blog');
    }

    this.addonConfig = app.project.config(process.env.EMBER_ENV).emberWriter || {};
  },

  config: function(/*environment, appConfig*/) {
    return {
      'emberWriter': {
        dateFormat: 'MM-DD-YYYY'
      }
    };
  },

  treeForPublic(tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }

    let blogFiles = new Funnel(this.blogDirectory, {
      destDir: 'api/blog',
      include: ['*.md']
    });

    this.markdownParser = new BlogMarkdownParser(blogFiles, this.addonConfig);
    trees.push(this.markdownParser);

    return new MergeTrees(trees);
  },

  postBuild(result) {
    let blogPath = path.join(result.directory, 'api', 'blog');

    // posts
    fs.writeJsonSync(`${blogPath}/posts.json`, this.markdownParser.parsedPosts);

    // tags
    let tags = this.markdownParser.parsedPosts.reduce((prev, post) => {
      let tags = post.attributes.tags.split(/,\s*/);
      return prev.concat(tags);
    }, []);

    let tagCounts = itemCounts(tags);

    let uniqueTags = _array.uniq(tags).map((tag) => {
      return {
        name: tag,
        postCount: tagCounts[tag]
      };
    });

    fs.writeJsonSync(`${blogPath}/tags.json`, uniqueTags);

    // authors
    let authors = this.markdownParser.parsedPosts.reduce((prev, post) => {
      return prev.concat(post.attributes.author);
    }, []);

    // add post counts to author data
    let authorDataFile = `${this.blogDirectory}/data/authors`;
    let authorData = require(authorDataFile);
    let authorCounts = itemCounts(authors);

    let authorsWithCounts = authors.map((name) => {
      let author = authorData.find((a) => a.name == name);

      if (!author) {
        throw(new Error(`${name} is an author of a post but is not a known author. Please add an entry to \`data/authors.json\` for them.`));
        return;
      }

      author.postCount = authorCounts[name];

      return author;
    });

    fs.writeJsonSync(`${blogPath}/authors.json`, authorsWithCounts);
  }
};

function itemCounts(array) {
  let counts = {};

  array.forEach((thing) => {
    let count = counts[thing] || 0;
    counts[thing] = count += 1;
  });

  return counts;
}
