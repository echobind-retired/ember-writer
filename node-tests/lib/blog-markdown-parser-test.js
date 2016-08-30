/* jshint node: true */
'use strict';

const BlogMarkdownParser = require('../../lib/blog-markdown-parser');
const expect = require('chai').expect;

let parser;
describe('BlogMarkdownParser', function() {
  beforeEach(function() {
    parser = new BlogMarkdownParser('.');
  });

  describe('getDestFilePath', function() {
    it('converts markdown and replaces the date from the filename with /posts', function() {
      let result = parser.getDestFilePath('blog/2006-01-02-some-title.md');
      expect(result).to.equal('blog/posts/some-title.json');
    });
  });

  describe('processString', function() {
    let result;

    describe('parsing frontmatter', function() {
      beforeEach(function() {
        let content =
`---
title: Yay Frontmatter
author: Dave
---
`;
        result = JSON.parse(parser.processString(content, '/something/2016-01-01-my-title'));
      });

      it('gets frontmatter as attributes', function() {
        expect(Object.keys(result.attributes)).to.have.length(2);
      });

      it('has the correct title', function() {
        expect(result.attributes.title).to.equal('Yay Frontmatter');
      });

      it('has the correct author', function() {
        expect(result.attributes.author).to.equal('Dave');
      });
    });

    describe('summary', function() {
      describe('READMORE provided', function() {
        beforeEach(function() {
          let content = `This is a **summary**.READMORE This is not.`
          result = JSON.parse(parser.processString(content, '/something/2016-01-01-my-title'));
        });

        it('creates a HTML summary from start of article to READMORE', function() {
          expect(result.summary).to.equal('<p>This is a <strong>summary</strong>.</p>');
        });
      });
    });

    describe('body', function() {
      describe('READMORE provided', function() {
        beforeEach(function() {
          let content = `This is a **summary**.READMORE This is not.`
          result = JSON.parse(parser.processString(content, '/something/2016-01-01-my-title'));
        });

        it('converts to HTML and removes READMORE', function() {
          expect(result.body).to.equal('<p>This is a <strong>summary</strong>. This is not.</p>');
        });
      });
    });

    describe('slug', function() {
      describe('from filename', function() {
        beforeEach(function() {
          result = JSON.parse(parser.processString('', '/something/2016-01-01-my-title'));
        });

        it('strips the date from the filename', function() {
          expect(result.slug).to.equal('my-title');
        });
      });

      describe('from frontmatter', function() {
        beforeEach(function() {
          let content =
`---
slug: what-the
---
`;
          result = JSON.parse(parser.processString(content, '/something/2016-01-01-my-title'));
        });

        it('uses the frontmatter instead of the filename', function() {
          expect(result.slug).to.equal('what-the');
        });
      });
    });
  });

  describe('parsedPosts', function() {
    beforeEach(function() {
      parser.processString('Post 1', '/something/2016-01-01-first-post');
      parser.processString('Post 2', '/something/2016-01-01-second-post');
    });

    it('saves all parsed posts', function() {
      expect(parser.parsedPosts).to.have.length(2);
      expect(parser.parsedPosts[0].body).to.equal('<p>Post 1</p>');
      expect(parser.parsedPosts[1].body).to.equal('<p>Post 2</p>');
    });
  });
});
