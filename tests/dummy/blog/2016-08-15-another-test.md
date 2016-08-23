---
title: Move your Ember Tests to Mocha
date: 2016-08-18 13:27 UTC
tags: ember, mocha
author: Chris Ball
---

ember-cli ships with QUnit as the default testing framework. If you'd like to move to Mocha here's a quick reference on how to do so. READMORE

<span class="badges">![ember version badge](https://embadge.io/v1/badge.svg?start=1.13.0)</span>

##### Why Mocha?

* It provides BDD style syntax using `describe`, `context`, `it`, etc
* It allows marking a test as pending
* It allows running specific tests using `only` or `skip`
* It provides chained assertions via [chai](http://chaijs.com) _(expect(a).to.have.length(3))_
* It deals well with async behavior

QUnit is still a good choice, but many JavaScript developers are using Mocha for the reasons above. In the end, it boils down to preference; ember-cli has good support for both.

##### Install ember-cli-mocha

```sh
ember install ember-cli-mocha
```

##### Replace test-helper when prompted
```sh
Overwrite tests/test-helper.js? (Yndh) Y
```

Here's the diff if you're curious:

```diff
--- /Users/cball/code/myapp/tests/test-helper.js
+++ /Users/cball/code/myapp/tests/test-helper.js
@@ -1,6 +1,4 @@
 import resolver from './helpers/resolver';
-import {
-  setResolver
-} from 'ember-qunit';
+import { setResolver } from 'ember-mocha';

 setResolver(resolver);
```

##### Start up your test server

If we start our server, we'll see a bunch of QUnit errors.

```sh
ember test --server
```

```txt
TEST'EM 'SCRIPTS!
Open the URL below in a browser to connect.
http://localhost:7357/
━━━━━━━━━┓
   PhantomJS   ┃     Chrome      Chrome 52.0
   12/19 ✘     ┃   12/19 ✘        12/19 ✘
               ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ✘ Can't find variable: QUnit
        n't findat http://localhost:7357/assets/tests.js:152:8
        	at exports (http://localhost:7357/assets/vendor.js:132:37)
        	at requireModule (http://localhost:7357/assets/vendor.js:32:25)
        	at require (http://localhost:7357/assets/test-loader.js:67:16)
        	at loadModules (http://localhost:7357/assets/test-loader.js:58:25)
        	at load (http://localhost:7357/assets/test-loader.js:89:35)
        	at http://localhost:7357/assets/test-support.js:14157:20
TestLoader Failures myapp/tests/helpers/module-for-acceptance.jshint: could not be loaded
    ✘ Can't find variable: QUnit
        n't findat http://localhost:7357/assets/tests.js:187:8
        	at exports (http://localhost:7357/assets/vendor.js:132:37)
        	at requireModule (http://localhost:7357/assets/vendor.js:32:25)
        	at require (http://localhost:7357/assets/test-loader.js:67:16)
        	at loadModules (http://localhost:7357/assets/test-loader.js:58:25)
        	at load (http://localhost:7357/assets/test-loader.js:89:35)
        	at http://localhost:7357/assets/test-support.js:14157:20
TestLoader Failures myapp/tests/helpers/resolver.jshint: could not be loaded
...etc
```

##### Make sure ember-cli-qunit is fully uninstalled

`ember-cli-mocha` tries to be nice and remove `ember-cli-qunit` from `our package.json`, but you'll likely still have a copy laying around in your `node_modules` folder. To ensure it is fully uninstalled, remove and re-install your node modules:

```sh
rm -rf node_modules && npm install
```

After restarting the server, things should look much better:

```

 ━━━━━━━━┓
   PhantomJS  ┃     Chrome      Chrome 52.0
   8/8 ✔      ┃    8/8 ✔        8/8 ✔
              ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If we load up the URL that the test runner provides us _(http://localhost:7357 by default)_, we should see a shiny new Mocha reporter page instead of the one provided by QUnit:

![mocha reporter](../images/migrate-to-mocha/reporter.png)


##### Remove Module For Acceptance

This step is optional, but `moduleForAcceptance` is not used by `ember-cli-mocha`. `ember-cli-mocha` modifies the built-in acceptance test blueprints with it's own calls to `startApp` and `destroyApp`. [Here's an example](https://gist.github.com/cball/99073a884808ce620d8744a21ae2b17d#file-user-should-something-js-L15-L21). Because of this, it's safe to remove.

```shell
rm tests/helpers/module-for-acceptance.js
```

##### Final steps: Convert your existing tests
Unfortunately, converting existing tests is a manual process. It's typically easiest to generate a fake test of the same type (acceptance, integration, or unit), copy that into your existing test, and then change everything to Mocha syntax.

Need to improve the test suite in your Ember App? [We can help](/hire-us).
