/*jshint node:true*/

const path = require('path');
const stringUtil = require('ember-cli-string-utils');
const moment = require('moment');

module.exports = {
  description: 'Generates a new blog article',

  fileMapTokens: function() {
    return {
      __blogDir__: function(options) {
        if (options.inAddon) {
          return path.join('tests', 'dummy', 'blog');
        } else {
          return '/blog';
        }
      },

      __name__: function(options) {
        return stringUtil.dasherize(options.locals.name);
      }
    };
  },

  locals: function(options) {
    // Return custom template variables here.
    return {
      name: options.entity.name
    };
  }
};
