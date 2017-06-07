import DS from 'ember-data';

const {
  JSONAPIAdapter,
  BuildURLMixin
} = DS;

export default JSONAPIAdapter.extend(BuildURLMixin, {
  namespace: 'api/blog',

  buildURL() {
    return `${this._super(...arguments)}.json`;
  }
});