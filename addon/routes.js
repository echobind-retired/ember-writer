import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('topics');
  this.route('topic', { path: 'topics/:id' });
  this.route('authors');
  this.route('author', { path: 'authors/:id' });
  this.route('post', { path: ':id' });
});
