import Koa from 'koa';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';
import {delay, openFiles} from './utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  await delay();
  await openFiles();
  ctx.status = 200;
  ctx.body = 'Hello Koa ES7';
});

listenCb(app);
