import express from 'express';
import assemble from 'assemble-core';
import loader from 'assemble-loader';
import {renameKey, cbToProm as promisify} from 'boiler-utils';
import nunjucks from 'nunjucks';
import consolidate from 'consolidate';
import makeConfig from '../utils/make-config';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay} from '../utils/log-commands';
import read from '../utils/read';
import getGlobalData from '../utils/template-data';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = express();
const config = makeConfig();
const duration = (start, key) => {
  if (!start) return new Date();

  key = key && key.toUpperCase() || 'DURATION';

  debug({
    warn: {
      [key]: new Date() - start
    }
  });
};
const {utils, sources} = config;
const {srcDir, templateDir} = sources;
const {addbase} = utils;

const setupTemplating = (fp) => {
  const start = duration();
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

  duration(start, 'TEMPLATE_SETUP');
  return app;
};

const as = setupTemplating();

app.use((req, res, next) => {
  const start = duration();
  const end = res.end;

  res.end = function(chunk, encoding) {
    res.end = end;
    res.end(chunk, encoding);
    duration(start);
  };

  //delay for 50ms
  delay().then(() => {
    duration(start, 'ARBITRARY_DELAY');
    next();
  });
});

app.use((req, res, next) => {
  const start = duration();

  read().then(() => {
    duration(start, 'READ_JSON');
    next();
  });
});

app.get('/assemble', (req, res, next) => {
  const page = as.pages.getView('pages/index');
  const data = {
    type: 'Assemble',
    title: 'assemble',
    message: 'Hello Koa ES6'
  };
  const render = promisify(page.render, {ctx: page});
  const start = duration();

  render(data).then(({content: html}) => {
    res.status = 200;
    res.send(html);

    duration(start, 'ASSEMBLE_CACHED_RENDER');
  }).catch(err => {
    res.status = 503;
  });
});

app.get('/assemble-new', (req, res, next) => {
  const asInstance = setupTemplating('pages/index.html');
  const page = asInstance.pages.getView('pages/index');
  const data = {
    type: 'Assemble New Instance',
    title: 'assemble',
    message: 'Hello Koa ES6'
  };
  const render = promisify(page.render, {ctx: page});
  const start = duration();

  render(data).then(({content: html}) => {
    res.status = 200;
    res.send(html);

    duration(start, 'ASSEMBLE_NEW_RENDER');
  }).catch(err => {
    res.status = 503;
  });
});

app.get('/nunjucks', (req, res, next) => {
  const templateFp = addbase(srcDir, templateDir, 'pages', 'index.html');
  const data = {
    type: 'Nunjucks',
    title: 'nunjucks',
    message: 'Hello Koa ES6'
  };
  const start = duration();

  consolidate.nunjucks(templateFp, data).then(html => {
    res.status = 200;
    res.send(html);

    duration(start, 'NUNJUCKS_RENDER');
  }).catch(err => {
    res.status = 503;
  });
});

listenCb(app);
