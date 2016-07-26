import Koa from 'koa';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay} from '../utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();

app.use(async (ctx, next) => {
  const start = new Date();

  await delay();

  ctx.status = 200;
  ctx.body = 'Hello Koa ES7';

  debug({
    warn: {
      duration: new Date() - start
    }
  });

  await next();
});

listenCb(app);
