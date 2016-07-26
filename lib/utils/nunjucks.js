import nunjucks from 'nunjucks';
import cons from 'consolidate';
import isFunction from 'lodash/isFunction';
import baseTemplateData from './template-data';

export default function(fp, config, data, opts = {}) {
  const type = 'Nunjucks';
  const nunj = nunjucks.configure({
    watch: false,
    noCache: true
  });

  Object.keys(opts).forEach(type => {
    const fn = opts[type];

    //add tags and filters
    if (isFunction(fn)) fn(nunj);
  });

  return cons.nunjucks(fp, {
    type,
    ...baseTemplateData(config),
    ...data
  });
}
