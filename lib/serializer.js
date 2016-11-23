/* jshint node: true */
'use strict';

const _lang = require('lodash/lang');
const itemCounts = require('./utils/item-counts');

class Serializer {
  constructor({ posts, authors }) {
    this.posts = markdownPostsToJSONAPI('post', posts);

    let tags = posts.reduce((prev, article) => {
      let articleTags = article.attributes.tags;
      articleTags = _lang.isEmpty(articleTags) ? '' : articleTags;
      let tokens = articleTags.split(/,\s*/);
      return prev.concat(tokens);
    }, []);

    this.tags = tagDocs(tags);

    this.authors = markdownPostsToJSONAPI('author', authors);
  }

  serialize(data = []) {
    return { data };
  }

  postsToJSONAPI() {
    return this.serialize(this.posts);
  }

  tagsToJSONAPI() {
    return this.serialize(this.tags);
  }

  authorsToJSONAPI() {
    return this.serialize(this.authors);
  }
}

module.exports = Serializer;

function markdownPostsToJSONAPI(type, items = []) {
  return items.map(doc => {
    return {
      id: doc.slug,
      type: type,
      attributes: Object.assign({}, doc.attributes, {
        body: doc.body,
        summary: doc.summary,
        slug: doc.slug
      })
    };
  });
}

function tagDocs(tags) {
  let tagCounts = itemCounts(tags);

  return Object.keys(tagCounts).map(tag => {
    return {
      id: tag,
      type: 'tag',
      attributes: {
        name: tag,
        postCount: tagCounts[tag]
      }
    };
  });
}