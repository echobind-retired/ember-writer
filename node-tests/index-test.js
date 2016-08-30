/* jshint node: true */
'use strict';

const AddonIndex = require('../index');
const expect = require('chai').expect;

describe('AddonIndex', function() {
  describe('included', function() {
    describe('in addon', function() {
      beforeEach(function() {
        let fakeApp = {
          project: {
            root: '/',
            pkg: {
              'ember-addon': true
            }
          }
        };

        AddonIndex.included(fakeApp);
      });

      it('sets blogDirectory to the dummy path', function() {
        let { blogDirectory } = AddonIndex;
        expect(blogDirectory).to.equal('/tests/dummy/blog');
      });
    });

    describe('in normal project', function() {
      beforeEach(function() {
        let fakeApp = {
          project: {
            root: '/',
            pkg: {}
          }
        };

        AddonIndex.included(fakeApp);
      });

      it('sets blogDirectory to the root path', function() {
        let { blogDirectory } = AddonIndex;
        expect(blogDirectory).to.equal('/blog');
      });
    });
  });

  describe('config', function() {
    it('sets addonConfig', function() {
      expect(AddonIndex.addonConfig).to.be.null;

      AddonIndex.config();

      expect(AddonIndex.addonConfig).to.not.be.empty;
    });

    it('returns the config to be merged into the main config', function() {
      let result = AddonIndex.config();
      expect(result.emberWriter).to.not.be.empty;
    });
  });
});
