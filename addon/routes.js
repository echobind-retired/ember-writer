import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('post', { path: ':slug' });
  this.route('topics');
  this.route('topic', { path: 'topics/:name' });
  this.route('author', { path: 'authors/:name' });
});
