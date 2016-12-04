/* jshint node: true */
'use strict';

const Plugin = require('broccoli-plugin');
const Builder = require('./builder');
const fixturify = require('fixturify');

// Create a subclass BlogPlugin derived from Plugin
BlogPlugin.prototype = Object.create(Plugin.prototype);
BlogPlugin.prototype.constructor = BlogPlugin;
function BlogPlugin(inputNodes, options = {}) {  
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

BlogPlugin.prototype.build = function() {

  let [ source ] = this.inputPaths;

  let data = fixturify.readSync(source);
  
  let builder = new Builder(data, this.options.isProduction);
  
  let built = builder.build();

  fixturify.writeSync(this.outputPath, built);
};

module.exports = BlogPlugin;