import Ember from 'ember';

export default Ember.Route.extend({
  // TODO: support pagination
  // /api/posts/2.json
  model() {
    return Ember.$.get('/api/posts.json');
  }
});
