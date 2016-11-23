/* jshint node: true */
'use strict';

const expect = require('chai').expect;
const Serializer = require('../../lib/serializer');

describe('Serializer', function() {
  let serializer, posts, authors, tags;
  beforeEach(function() {
    serializer = new Serializer({
      posts: [
        {
          attributes: {
            title: 'hello world',
            author: 'Bob',
            tags: 'post, new'
          },
          body: `☀️ and 🌈 over here`,
          summary: 'beautiful',
          slug: 'hello-world'
        }
      ],
      authors: [
        {
          slug: 'bob',
          attributes: {
            name: 'Bob'
          }
        }
      ]
    });
    posts = serializer.postsToJSONAPI();
    authors = serializer.authorsToJSONAPI();
    tags = serializer.tagsToJSONAPI();
  });
  it('generates posts in JSONAPI', function() {
    expect(posts.data[0]).to.deep.equal({
      id: 'hello-world',
      type: 'post',
      attributes: {
        slug: 'hello-world',
        title: 'hello world',
        author: 'Bob',
        body: `☀️ and 🌈 over here`,
        summary: 'beautiful',
        tags: 'post, new'
      }
    });
  });
  it('generates author in JSONAPI', function() {
    expect(authors.data[0]).to.deep.equal({
      id: 'bob',
      type: 'author',
      attributes: {
        name: 'Bob',
        body: undefined,
        summary: undefined,
        slug: 'bob'
      }
    });
  });
  it('generates tags in JSONAPI', function() {
    expect(tags.data).to.deep.equal([
      {
        id: 'post',
        type: 'tag',
        attributes: {
          name: 'post',
          postCount: 1
        }
      },
      {
        id: 'new',
        type: 'tag',
        attributes: {
          name: 'new',
          postCount: 1
        }
      }
    ]);
  })
});