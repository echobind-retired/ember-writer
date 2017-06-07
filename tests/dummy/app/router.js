import Ember from 'ember';
import config from './config/environment';

const {
  Router: EmberRouter
} = Ember;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('blog', function() {
    this.route('topics');
    this.route('topic', { path: 'topics/:id' });
    this.route('authors');
    this.route('author', { path: 'authors/:id' });
    this.route('post', { path: ':id' });
  });
});

export default Router;
