import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('topics');
  this.route('topic', { path: 'topics/:name' });
  this.route('authors');
  this.route('author', { path: 'authors/:name' });
  this.route('post', { path: ':slug' });
});
