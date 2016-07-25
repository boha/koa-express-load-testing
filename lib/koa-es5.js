const Koa = require('koa');
const debug = require('./utils/run-debug').debug;
const listenCb = require('./utils/listen-cb-es5');
const openFiles = require('./utils/log-commands').openFiles;

const DEBUG = process.env.DEBUG;

debug(`Starting ${DEBUG}`);

const app = new Koa();

// response
app.use((ctx, next) => {
  next().then(() => {
    openFiles();
    ctx.body = 'Hello Koa ES5';
  });
});

listenCb(app);
