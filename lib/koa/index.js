import Koa from 'koa';
import Router from 'koa-router';
import assemble from 'assemble-core';
import loader from 'assemble-loader';
import {renameKey, cbToProm as promisify} from 'boiler-utils';
import nunjucks from 'nunjucks';
import consolidate from 'consolidate';
import makeRender from '../utils/renderer';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay} from '../utils/log-commands';
import read from '../utils/read';
import getGlobalData from '../utils/template-data';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();
const router = new Router();
const {render, config} = makeRender();
const duration = (start) => {
  debug({
    warn: {
      DURATION: new Date() - start
    }
  });
};
const {utils, sources} = config;
const {srcDir, templateDir} = sources;
const {addbase} = utils;

const setupTemplating = (fp) => {
  const app = assemble();
  const nunj = nunjucks.configure({
    watch: true,
    noCache: false
  });
  const templateFns = getGlobalData(config);

  Object.keys(templateFns).forEach(name => {
    nunj.addGlobal(name, templateFns[name]);
  });

  const templatePaths = addbase(srcDir, templateDir, fp || '**/*.html');

  app.engine('.html', consolidate.nunjucks);
  app.create('pages', {renameKey}).use(loader()); //create the `pages` type
  app.pages(templatePaths); //load the pages

  return app;
};
const as = setupTemplating();

router.get('/assemble', async (ctx, next) => {
  const page = as.pages.getView('pages/index');
  const data = {
    type: 'Assemble',
    title: 'assemble',
    message: 'Hello Koa ES6'
  };
  const render = promisify(page.render, {ctx: page});

  try {
    const html = await render(data);

    ctx.status = 200;
    ctx.body = html.content;
  } catch (err) {
    ctx.status = 503;
  }
});

router.get('/assemble-new', async (ctx, next) => {
  const asInstance = setupTemplating('pages/index.html');
  const page = asInstance.pages.getView('pages/index');
  const data = {
    type: 'Assemble New Instance',
    title: 'assemble',
    message: 'Hello Koa ES6'
  };
  const render = promisify(page.render, {ctx: page});

  try {
    const html = await render(data);

    ctx.status = 200;
    ctx.body = html.content;
  } catch (err) {
    ctx.status = 503;
  }
});

router.get('/nunjucks', async (ctx, next) => {
  const templateFp = addbase(srcDir, templateDir, 'pages', 'index.html');
  const data = {
    type: 'Nunjucks',
    title: 'nunjucks',
    message: 'Hello Koa ES6'
  };

  try {
    const html = await consolidate.nunjucks(templateFp, data);

    ctx.status = 200;
    ctx.body = html;
  } catch (err) {
    ctx.status = 503;
  }
});

router.get('/read', async (ctx, next) => {
  const json = await read();

  duration(ctx.start);
  ctx.status = 200;
  ctx.body = json;
});

router.get('/:type', async (ctx, next) => {
  const {type} = ctx.params;
  const [, split] = type.split('-');
  const data = {
    title: 'home',
    message: 'Hello Koa ES6'
  };
  const fp = 'index';
  const opts = {
    type
  };

  if (split === 'basic') {
    //use assemble without boiler config
    opts.basic = true;
  }

  try {
    const html = await render(fp, data, opts);

    ctx.status = 200;
    ctx.body = html;
  } catch (err) {
    ctx.status = 404;
  }

  duration(ctx.start);
});

app.use(async (ctx, next) => {
  ctx.start = new Date();

  await delay();
  await next();
});

app.use(router.routes());

listenCb(app);
