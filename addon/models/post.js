import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  title: attr(),
  date: attr('date'),
  body: attr(),
  summary: attr(),
  slug: attr(),
  author: belongsTo(),
  tags: hasMany()
});