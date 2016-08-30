import moment from 'moment';
import config from 'ember-get-config';
import { helper } from 'ember-helper';

const { dateFormat } = config.emberWriter;

export function formatDate([date], { format }={}) {
  format = format || dateFormat;

  return moment(date).format(format);
}

export default helper(formatDate);
