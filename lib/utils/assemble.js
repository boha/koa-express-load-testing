import loader from 'assemble-loader';
import {renameKey} from 'boiler-utils';
import makeApp from 'boiler-config-assemble';
import assemble from 'assemble-core';
import nunjucks from 'nunjucks';
import consolidate from 'consolidate';
import baseTemplateData from './template-data';
import {debug} from './run-debug';

export default async function(pagePath, config, data, opts = {}) {
  const now = () => new Date();
  const time = (start) => start ? now() - start : now();
  const {
    registerTags,
    middleware,
    basic
  } = opts;
  const type = 'Assemble';
  let app, assets;

  if (basic) {
    app = assemble();
    nunjucks.configure({
      watch: false,
      noCache: true
    });
    app.engine('.html', consolidate.nunjucks);
    //add data to assemble
    app.data({
      type,
      ...baseTemplateData(config),
      ...data
    });
  } else {
    const assembleData = {
      assemble: {
        data: Object.assign({}, data, {type}),
        registerTags,
        middleware
      }
    };
    const assembleConfig = makeApp(
      Object.assign({}, config, assembleData)
    );

    app = assembleConfig.app;

    const parseAssetsStart = time();
    try {
      assets = await assembleConfig.assets;
    } catch (err) {
      console.error('Assemble couldn\'t parse assets', err.message, err.stack);
    }

    debug({
      warn: {
        ASSMBLE_ASSETS_DURATION: time(parseAssetsStart)
      }
    });
  }

  app.create('pages', {renameKey}).use(loader()); //create the `pages` type

  app.pages(pagePath); //load the page

  const page = app.pages.getView(
    renameKey(pagePath)
  );

  if (!page) {
    throw new Error('Assemble couldn\'t retrieve loaded page');
  }

  const renderStart = time();
  return await new Promise((res, rej) => {
    const ctx = {
      assets
    };

    page.render(ctx, (err, html) => {
      if (err) return rej(err);


      debug({
        warn: {
          ASSMBLE_RENDER_DURATION: time(renderStart)
        }
      });
      res(html.content);
    });
  });
}
