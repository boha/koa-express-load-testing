import path from 'path';
import merge from 'lodash/merge';
import makeConfig from 'boiler-config-base';

export default function(mixin = {}) {
  const config = makeConfig(
    path.resolve(__dirname, '..', 'boiler.config.js')
  );

  return merge(config, mixin);
}
