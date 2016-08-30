/* jshint node: true */
'use strict';

const AddonIndex = require('../index');
const expect = require('chai').expect;
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const fs = require('fs-extra');
const path = require('path');
const temp = require('temp');

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

  describe('postBuild', function() {
    let tempDir;
    let blogPath;
    this.timeout(1000);

    beforeEach(function() {
      let tmproot = path.resolve(__dirname, '../tmp');
      // tempDir = fs.mkdtempSync(`${tmproot}${path.sep}`);
      tempDir = temp.mkdirSync('post-build');
      blogPath = path.join(tempDir, 'api', 'blog');
      fs.mkdirsSync(blogPath);
      let dataPath = path.join(tempDir, 'data');
      fs.mkdirsSync(dataPath);

      fs.writeFileSync(path.join(dataPath, 'authors.js'), 'module.exports=[{ name: "Dave" }]');
    });

    describe('posts.json', function() {
      describe('in production', function() {
        beforeEach(function() {
          let fakeApp = {
            env: 'production',
            project: {
              root: '/',
              pkg: {}
            }
          };

          let fakeMarkdownParser = {
            parsedPosts: [
              {
                attributes: {
                  author: 'Dave',
                  title: 'Draft Post',
                  published: false
                }
              },
              {
                attributes: {
                  author: 'Dave',
                  title: 'Published Post'
                }
              }
            ]
          };

          AddonIndex.app = fakeApp;
          AddonIndex.blogDirectory = tempDir;
          AddonIndex.markdownParser = fakeMarkdownParser;
          AddonIndex.postBuild({
            directory: tempDir
          });
        });

        it('does not include draft articles', function() {
          let articles = fs.readJSONSync(`${blogPath}/posts.json`);
          let draftArticle = articles.find((a) => a.attributes.title === 'Draft Post');

          expect(draftArticle).to.be.undefined;
        });
      });

      describe('in development', function() {
        beforeEach(function() {
          let fakeApp = {
            env: 'development',
            project: {
              root: '/',
              pkg: {}
            }
          };

          let fakeMarkdownParser = {
            parsedPosts: [
              {
                attributes: {
                  author: 'Dave',
                  title: 'Draft Post',
                  published: false
                }
              },
              {
                attributes: {
                  author: 'Dave',
                  title: 'Published Post'
                }
              }
            ]
          };

          AddonIndex.app = fakeApp;
          AddonIndex.blogDirectory = tempDir;
          AddonIndex.markdownParser = fakeMarkdownParser;
          AddonIndex.postBuild({
            directory: tempDir
          });
        });

        it('includes draft articles', function() {
          let articles = fs.readJSONSync(`${blogPath}/posts.json`);
          let draftArticle = articles.find((a) => a.attributes.title === 'Draft Post');

          expect(draftArticle).to.be.ok;
        });
      });
    });

    describe('tags.json', function() {
      beforeEach(function() {
        let fakeApp = {
          env: 'development',
          project: {
            root: '/',
            pkg: {}
          }
        };

        let fakeMarkdownParser = {
          parsedPosts: [
            {
              attributes: {
                author: 'Dave',
                tags: 'ember, testing'
              }
            },
            {
              attributes: {
                author: 'Dave',
                tags: 'testing,cycling'
              }
            }
          ]
        };

        AddonIndex.app = fakeApp;
        AddonIndex.blogDirectory = tempDir;
        AddonIndex.markdownParser = fakeMarkdownParser;
        AddonIndex.postBuild({
          directory: tempDir
        });
      });

      it('creates tags with post counts', function() {
        let tags = fs.readJSONSync(`${blogPath}/tags.json`);
        let tagNames = tags.map((t) => t.name);
        let emberTag = tags.find((t) => t.name === 'ember');
        let testingTag = tags.find((t) => t.name === 'testing');

        expect(tags).to.have.length(3);
        expect(tagNames).to.contain('ember', 'testing', 'cycling');
        expect(emberTag.postCount).to.equal(1);
        expect(testingTag.postCount).to.equal(2);
      });
    });

    describe('authors.json', function() {
      beforeEach(function() {
        let fakeApp = {
          env: 'development',
          project: {
            root: '/',
            pkg: {}
          }
        };

        let fakeMarkdownParser = {
          parsedPosts: [
            {
              attributes: {
                author: 'Dave',
                tags: 'ember, testing'
              }
            },
            {
              attributes: {
                author: 'Dave',
                tags: 'testing,cycling'
              }
            }
          ]
        };

        AddonIndex.app = fakeApp;
        AddonIndex.blogDirectory = tempDir;
        AddonIndex.markdownParser = fakeMarkdownParser;
        AddonIndex.postBuild({
          directory: tempDir
        });
      });

      it('creates authors with post counts', function() {
        let authors = fs.readJSONSync(`${blogPath}/authors.json`);
        let dave = authors.find((a) => a.name === 'Dave');

        expect(authors).to.have.length(1);
        expect(dave.postCount).to.equal(2);
      });
    });
  });
});
