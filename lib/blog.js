/* jshint node: true */
'use strict';

const fixturify = require('fixturify');
const Fixturify = require('broccoli-fixturify');
const frontMatter = require('front-matter');
const showdown = require('showdown');
const path = require('path');
const uniqBy = require('lodash.uniqby');
const flatMap = require('lodash.flatmap');

const { reduceObject, mapObject, values } = require('./utils/object');

const { assign } = Object;

const POST_NAME_PATTERN = /\d{4}-\d{1,2}-\d{1,2}-/;

module.exports = class Blog {
  constructor(source, isProduction) {
    this.data = fixturify.readSync(source);
    this.isProduction = isProduction;

    this.converter = new showdown.Converter();
  }

  makeHtml(content) {
    return this.converter.makeHtml(content);
  }

  /**
   * Parse all .md files in a directory as a frontMatter attributes object 
   * and remove all none .md files.
   */
  parse(directory = {}) {
    return reduceObject(directory, (result, name, content) => {
      // parses markdown files as frontMatter
      // removes all other files from directory
      if (isMarkdown(name)) {
        let { body, attributes } = frontMatter(content);
        let slug = attributes.slug || slugFromFilename(name);
        let summary = summaryFromContent(body);
        let tags = (attributes.tags || '').split(/,\s*/);

        return assign(result, {
          [slug]: assign({}, attributes, {
            slug,
            summary: this.makeHtml(summary),
            body: this.makeHtml(body),
            tags
          })
        });
      } else {
        return result;
      }
    });
  }

  /**
   * Evaluates to a directory of posts from data directory
   */
  get posts() {
    // choose only post files from data directory
    let posts = reduceObject(this.data, function(result, name, content){
      if (name.match(POST_NAME_PATTERN)) {
        return assign(result, {
          [name]: content
        });
      } else {
        return result;
      }
    });
    return this.parse(posts);
  }

  /**
   * Evaluates to a directory of authors from authors directory
   */
  get authors() {
    return this.parse(this.data.authors);
  }

  /**
   * Evaluates to a directory of tags from tags directory
   */
  get tags() {
    return this.parse(this.data.tags);
  }

  /**
   * Removed unpublished content items from directory
   */
  onlyPublished(directory) {
    return reduceObject(directory, (result, name, data) => {
      if (this.isProduction && data.published === false) {
        // remove item from directory
        return result;
      } else {
        // keep item in directory
        return assign(result, {
          [name]: data
        });
      } 
    });
  }

  /**
   * Evalutes to an array of published posts
   */
  get publishedPosts() {
    return this.onlyPublished(this.posts);
  }

  /**
   * Evalutes to an array of published authors
   */
  get publishedAuthors() {
    return this.onlyPublished(this.authors);
  }

  /**
   * Evalutes to an array of published tags
   */
  get publishedTags() {
    return this.onlyPublished(this.tags);
  }

  /**
   * Retrieve attributes of a page by type and slug
   */
  lookup(type, slug) {
    let collection = this[`published${capitalize(type)}s`];
    let item = collection[slug];
    if (item) {
      return item;
    } else {
      throw(new Error(`Could not find ${type} with slug ${slug}`));
    }
  }

  /**
   * Evaluates to an object representation of the posts directory
   * with each file formatted as JSONAPI top level
   */
  get postsDirectory() {
    return mapObject(this.publishedPosts, (name, post) => {
      let author = this.lookup('author', post.author);
      let tags = post.tags.filter(tag => tag !== '').map(tag => this.lookup('tag', tag));

      let doc = this.doc('post', post, {
        author: this.relationship('author', author),
        tags: this.relationships('tag', tags)
      });

      return {
        data: doc,
        included: [].concat(
          this.doc('author', author), 
          this.docs('tag', tags)
        )
      };
    });
  }

  /**
   * Returns a JSONAPI top level with all documents and included
   * documents grouped together.
   */
  list(directory) {
    let items = values(directory);

    let data = items.map(({ data }) => data );
    let included = flatMap(items, ({ included }) => included );

    return {
      data,
      included: uniqBy(included, ({ type, id }) => `${type}-${id}`)
    };
  }

  get postsJson() {
    return this.list(this.postsDirectory);
  }

  get authorsJson() {
    return this.list(this.authorsDirectory);
  }

  get tagsJson() {
    return this.list(this.tagsDirectory);
  }

  get authorsDirectory() {
    return mapObject(this.publishedAuthors, (slug, author) => {
      let posts = values(this.publishedPosts).filter(({author}) => author === slug);

      let doc = this.doc('author', author, {
        posts: this.relationships('post', posts)
      });

      return {
        data: doc,
        included: this.docs('post', posts)
      };
    });
  }

  get tagsDirectory() {
    return mapObject(this.publishedTags, (slug, tag) => {
      let posts = values(this.publishedPosts).filter(({tags}) => tags.indexOf(slug) !== -1);

      let doc = this.doc('tag', tag, {
        posts: this.relationships('post', posts)
      });

      return {
        data: doc,
        included: this.docs('post', posts)
      };
    });
  }

  doc(type, attributes, relationships) {
    let { slug } = attributes;
    return {
      id: slug,
      type,
      attributes,
      relationships
    };
  }

  docs(type, items = []) {
    return items.map(item => this.doc(type, item));
  }

  relationship(type, { slug }) {
    return { data: { id: slug, type } };
  }

  relationships(type, items = []) {
    return {
      data: items.map(({ slug }) => { return { id: slug, type }; })
    };
  }

  toTree() {
    return new Fixturify({
      'posts': serializeDirectory(this.postsDirectory),
      'posts.json': serializeFile(this.postsJson),
      'authors': serializeDirectory(this.authorsDirectory),
      'authors.json': serializeFile(this.authorsJson),
      'tags': serializeDirectory(this.tagsDirectory),
      'tags.json': serializeFile(this.tagsJson)
    });

    function serializeDirectory(directory) {
      return reduceObject(directory, function(result, name, data) {
        if (data) {
          return assign(result, {
            [`${name}.json`]: JSON.stringify(data)
          });
        } else {
          return result;
        }
      });
    }

    function serializeFile(data) {
      return JSON.stringify(data);
    }
  }
};

function isMarkdown(filename) {
  return path.extname(filename) === '.md';
}

function slugFromFilename(filename, extension='md') {
  let basename = path.basename(filename, `.${extension}`);
  return basename.replace(POST_NAME_PATTERN, '');
}

const DEFAULT_SUMMARY_LENGTH = 250;
function summaryFromContent(content) {
  return _summaryFromReadMore(content) || content.substring(0, DEFAULT_SUMMARY_LENGTH);
}

function _summaryFromReadMore(content) {
  let readMoreIndex = content.indexOf('READMORE');
  return content.substring(0, readMoreIndex);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}