import Route from 'ember-route';
import service from 'ember-inject/service';

export default Route.extend({
  ajax: service(),

  model() {
    return this.get('ajax').request('/api/blog/posts.json');
  }
});
