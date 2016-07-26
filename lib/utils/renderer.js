import makeConfig from './make-config';
import assemble from './assemble';
import nunjucks from './nunjucks';
import {debug} from './run-debug';

export default function(mixin) {
  const config = makeConfig(mixin);
  const {sources, utils} = config;
  const {srcDir, templateDir} = sources;
  const {addbase} = utils;
  const now = () => new Date();
  const time = (start) => start ? now() - start : now();
  const render = async (fp, data, opts = {}) => {
    const {
      type,
      tags,
      ...rest
    } = opts;
    const pagePath = addbase(srcDir, templateDir, 'pages', `${fp}.html`);
    const noop = (arg) => arg;
    const options = {
      registerTags: tags || noop,
      ...rest
    };
    const start = time();
    let html;

    switch (type) {
      case 'nunjucks':
        html = await nunjucks(pagePath, config, data, options);
        break;
      case 'assemble':
      default:
        html = await assemble(pagePath, config, data, options);
        break;
    }

    debug({
      warn: {
        RENDER_DURATION: time(start)
      }
    });

    return html;
  };

  return {
    config,
    render
  };
}
