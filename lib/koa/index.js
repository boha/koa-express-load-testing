import Koa from 'koa';
import Router from 'koa-router';
import makeRender from '../utils/renderer';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay} from '../utils/log-commands';
import read from '../utils/read';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();
const router = new Router();
const {render} = makeRender();
const duration = (start) => {
  debug({
    warn: {
      DURATION: new Date() - start
    }
  });
};

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

// response
app.use(router.routes());

listenCb(app);
