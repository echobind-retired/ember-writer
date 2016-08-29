/*jshint node:true*/
const path = require('path');

module.exports = {
  description: 'Installs the files necessary for ember-writer',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  fileMapTokens: function() {
   return {
     __root__: function(options) {
       if (options.inAddon) {
         return path.join('tests', 'dummy', 'blog');
       } else {
         return '/blog';
       }
     }
   };
 },

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
