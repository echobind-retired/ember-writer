import Ember from 'ember';
import Application from 'ember-application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  engines: {
    emberWriter: {
      dependencies: {
        services: [
          'store'
        ]
      }
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
