# Ember Writer

A configurable blog engine for your Ember app. Inspired by [Middleman](https://middlemanapp.com/) but integrated with Ember.

---

Want to run your blog as a static site, but miss everything you get from an Ember app? Don't want to spin up a Ghost or Wordpress Instance or worry about configuring a load balancer to serve subdirectories just to add a blog?

Ember writer can help.

Features:
* Parses posts written in Markdown format with support for YAML frontmatter
* Written as an engine to mount a fully featured blog at any path
* Builds a static API for articles, tags, and authors
* Includes syntax highlighting for code blocks via highlightjs

## Getting Started

NOTE: This addon requires engines, so your app **must be running Ember 2.8 beta or later**.

We have one known blocker for initial release: See [#30](https://github.com/echobind/ember-writer/issues/30) for details.

#### Install the addon
```sh
ember install ember-writer
```

#### Mount the blog engine at the desired path:
```js
Router.map(function() {
  this.mount('ember-writer', { path: 'blog' });
});
```

#### Generate a new blog post:
```sh
ember g article "My Amazing Post Title"
```

#### Generate a new author:
```sh
ember g author "Koolaid Man"
```

## Configuring Ember Writer
Ember writer will place a config file at `config/ember-writer`. Uncomment or change any of these lines to set config options.

```js
// config/ember-writer.js
/*jshint node:true*/

// Use this file to configure Ember Writer. Commented lines are the defaults.

module.exports = {
  // dateFormat: 'MM-DD-YYYY',
  // namespace: 'api/blog'
};
```

## Article Summaries
Article summaries are supported by the `READMORE` keyword, which is stripped
from the full article body:

```md
---
title: Draft Article
date: Tue Aug 30 2016 12:19:38 GMT-0400 (EDT)
author: Chris Ball
---

I'm a **new** article summary! READMORE

This is the main body:
```

If you don't supply `READMORE`, article summary will truncate at 250 characters.

## Draft Articles
Create draft articles using `published: false` in the frontmatter:

```md
---
title: Draft Article
date: Tue Aug 30 2016 12:19:38 GMT-0400 (EDT)
author: Chris Ball
published: false
---
```

Draft articles are visible in the development environment only.

## Syntax Highlighting
Syntax highlighting is provided by highlightjs. Add theme styles to your app (see the dummy app for an example).

## Customizing templates
~~To customize article templates, generate a template of the same name in your application. Note: this addon is currently under heavy development, so expect the template structure to change.~~

**This is currently pending (tracked in [#30](https://github.com/echobind/ember-writer/issues/30)), and is a major blocker for releasing this addon.**

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
