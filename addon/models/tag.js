import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const {
  computed: { readOnly }
} = Ember;

export default Model.extend({
  name: attr(),
  posts: hasMany(),
  postCount: readOnly('posts.length')
});