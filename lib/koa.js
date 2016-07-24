import Koa from 'koa';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = new Koa();

// response
app.use((ctx, next) => {
  next().then(() => {
    ctx.body = 'Hello Koa ES6';
  });
});

listenCb(app);
