import Koa from 'koa';
import {sources} from './config';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  ctx.body = 'Hello Koa ES7';
});

const {serverPort: port = 3000} = sources;

app.listen(port, listenCb(port));
