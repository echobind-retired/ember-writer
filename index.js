/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const BlogMarkdownParser = require('./lib/blog-markdown-parser');
const path = require('path');
const fs = require('fs-extra');
const _array = require('lodash/array');
const EngineAddon = require('ember-engines/lib/engine-addon');
const Serializer = require('./lib/serializer');
const itemCounts = require('./lib/utils/item-counts');

module.exports = EngineAddon.extend({
  name: 'ember-writer',

  /**
   * Stores the config object.
   * @type {Object}
   * @property
   * @public
   */
  addonConfig: null,

  included(app) {
    if (app.project.pkg['ember-addon'] && !app.project.pkg['ember-addon'].paths) {
      this.blogDirectory = path.resolve(app.project.root, path.join('tests', 'dummy', 'blog'));
    } else {
      this.blogDirectory = path.join(app.project.root, '/blog');
    }
  },

  config: function() {
    let appConfig = require('./config/ember-writer');
    let config = getDefaultConfig();

    this.addonConfig = Object.assign(config, appConfig);

    return {
      emberWriter: this.addonConfig
    };
  },

  treeForPublic(tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }

    let blogFiles = new Funnel(this.blogDirectory, {
      destDir: this.addonConfig.namespace,
      include: ['*.md']
    });

    this.markdownParser = new BlogMarkdownParser(blogFiles, this.addonConfig);
    trees.push(this.markdownParser);

    return new MergeTrees(trees);
  },

  postBuild(result) {

    let blogPath = path.join(result.directory, this.addonConfig.namespace);

    let serializer = new Serializer({
      articles: this._visibleArticles(),
      authors: this._visibleAuthors()
    });

    writeJSON('posts', serializer.articlesToJSONAPI());
    writeJSON('tags', serializer.tagsToJSONAPI());
    writeJSON('authors', serializer.authorsToJSONAPI());

    function writeJSON(filename, data) {
      fs.writeJsonSync(path.join(blogPath, `${filename}.json`), data);
    }
  },

  /**
   * Removes draft articles unless in a development environment.
   * @return {Array} Articles with published = false
   * @private
   */
  _visibleArticles() {
    let isDevelopment = this.app.env === 'development';
    let allArticles = this.markdownParser.parsedPosts;

    if (!isDevelopment) {
      let draftArticles = allArticles.filter((a) => a.attributes.published === false);
      return _array.difference(allArticles, draftArticles);
    }

    return allArticles;
  },

  _visibleAuthors() {
    let authorData = require(`${this.blogDirectory}/data/authors`);
    let articles = this._visibleArticles();
    let authors = articles.map(item => item.attributes.author);

    let postCounts = itemCounts(authors);

    return _array.uniq(authors).map(name => {
      let author = authorData.find((a) => (a.attributes || {}).name === name);

      if (!author) {
        throw(new Error(`${name} is an author of a post but is not a known author. Please add an entry to \`data/authors.json\` for them.`));
      }

      return Object.assign({}, author, {
        attributes: Object.assign({}, author.attributes, {
          postCount: postCounts[name]
        })
      });
    });

  }
});

/**
 * The default config for Ember Writer
 * @return {Object} The config
 * @public
 */
function getDefaultConfig() {
  return {
    dateFormat: 'MM-DD-YYYY',
    namespace: 'api/blog'
  };
}
