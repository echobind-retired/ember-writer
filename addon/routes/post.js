import Ember from 'ember';

export default Ember.Route.extend({
  model({ slug }) {
    return Ember.$.get(`/api/blog/posts/${slug}.json`);
  }
});
