# Ember Writer

A configurable blog engine for your Ember app. Inspired by [Middleman](https://middlemanapp.com/) but integrated with Ember.

---

Want to run your blog as a static site, but miss everything you get from an Ember app? Don't want to spin up a Ghost or Wordpress Instance or worry about configuring a load balancer to serve subdirectories just to add a blog?

Ember writer can help.

Features:
* Parses posts written in Markdown format with support for YAML frontmatter
* Written as an engine to mount a fully featured blog at the path of your choosing
* Builds a static API for posts with pagination, tags, and authors
* Includes syntax highlighting for code blocks

## Getting Started

* Install the addon (`ember install ember-writer`)
* Mount the blog engine at the desired path:
```js
Router.map(function() {
  this.mount('ember-writer', { path: 'blog' });
});
```
* Generate a new blog post:
```sh
ember g blog-post "My Amazing Post Title"
```
* Add additional writers to `blog/data/authors.json`:
```json
[
  {
    "name": "Mr Robot",
    "image": "https://images.bwwstatic.com/tvshowlogos/F90CFD8D-FF12-4B44-B4F22FFF6E594964.jpg"
  }
]
```

## Configuring Ember Writer
TODO
- permalink URL (defaults to {mount path}/{article slug})
- default date format (defaults to MM)
- articles per page (defaults to all)

## Article Summaries
TODO
- Supports article summaries via READMORE keyword

## Draft Articles
TODO
- published: false
- future date

## Syntax Highlighting
TODO

## Pagination
TODO

## Tags
TODO

## Adding Author Data
TODO

## Customizing templates
TODO
- Override info (post component template, post-list component template, entire templates)

## Included helpers
TODO
- sort-by?

## Adding additional data
TODO
- talk about data folder

## Possible Future Plans
- Adapter for local blog or remote blog

## License

Ember Writer is Copyright &copy; 2016 Echobind. It is free software, and may be
redistributed under the terms specified in the [MIT-LICENSE][MIT] file.

## About Echobind

![Echobind](https://echobind.s3.amazonaws.com/images/echobind-logo-black.svg)

Ember Writer is maintained and funded by Echobind.

[@echobind](http://twitter.com/echobind)

We love open source! See [our other projects][community] or [hire us][hire] to bring your idea to life.

[community]: https://github.com/echobind
[hire]: https://echobind.com?utm_source=github
[MIT]: http://www.opensource.org/licenses/mit-license.php
