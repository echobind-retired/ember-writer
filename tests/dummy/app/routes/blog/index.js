import Ember from 'ember';
import Route from 'ember-route';

const {
  inject: { service }
} = Ember;

export default Route.extend({
  store: service(),
  model() {
    return this.get('store').findAll('post');
  }
});
