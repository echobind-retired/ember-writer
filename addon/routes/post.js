import Route from 'ember-route';
import request from 'ember-ajax/request';

export default Route.extend({
  model({ slug }) {
    return request(`/api/blog/posts/${slug}.json`);
  }
});
