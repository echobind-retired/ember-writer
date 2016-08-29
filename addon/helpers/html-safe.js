import { helper } from 'ember-helper';
import { htmlSafe as markSafe } from 'ember-string';

export function htmlSafe([string]) {
  return markSafe(string);
}

export default helper(htmlSafe);
