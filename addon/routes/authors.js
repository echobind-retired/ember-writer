import Route from 'ember-route';
import request from 'ember-ajax/request';

export default Route.extend({
  model() {
    return request('/api/blog/authors.json');
  }
});
