import _ from 'lodash';
import states from './states';

export default function(gulp, plugins, config, opts) {
  const {sources} = config;
  const {geoHeader, internalHost, devPort, serverPort} = sources;
  const proxyPath = `http://${internalHost}:${serverPort}`;
  const {data} = opts;
  const {middleware} = data.server;
  const statesArr = Object.keys(states);
  const len = statesArr.length - 1;

  const bsConfig = {
    open: false,
    port: devPort,
    proxy: {
      target: proxyPath,
      middleware,
      reqHeaders() {
        const i = _.random(0, len);

        return {
          [geoHeader]: statesArr[i]
        };
      }
    }
  };

  return {
    data: bsConfig
  };
}
