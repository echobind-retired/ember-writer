/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');
const Plugin = require('./lib/plugin');

module.exports = {
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

  config() {
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

    let plugin = new Plugin([this.blogDirectory], {
      isProduction: this.app.env === 'production'
    });

    let api = new Funnel(plugin, {
      src: '/',
      destDir: this.addonConfig.namespace,
      include: ['**/*.json']
    });

    trees.push(api);

    return new MergeTrees(trees);
  }
};

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
