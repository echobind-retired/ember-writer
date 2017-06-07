import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const {
  Application
} = Ember;

const { modulePrefix } = config;

let App = Application.extend({
  modulePrefix,
  Resolver
});

loadInitializers(App, modulePrefix);

export default App;
