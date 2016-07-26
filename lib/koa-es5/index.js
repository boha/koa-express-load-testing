const Koa = require('koa');
const debug = require('../utils/run-debug').debug;
const listenCb = require('../utils/listen-cb-es5');
const cmds = require('../utils/log-commands');
const delay = cmds.delay;

const DEBUG = process.env.DEBUG;

debug(`Starting ${DEBUG}`);

const app = new Koa();

app.use((ctx, next) => {
  delay.then(() => {
    return next();
  });
});

// response
app.use((ctx, next) => {
  next().then(() => {
    ctx.status = 200;
    ctx.body = 'Hello Koa ES5';
  });
});

listenCb(app);
