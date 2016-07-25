const Koa = require('koa');
const debug = require('./utils/run-debug').debug;
const listenCb = require('./utils/listen-cb-es5');
const cmds = require('./utils/log-commands');
const openFiles = cmds.openFiles;
const delay = cmds.delay;

const DEBUG = process.env.DEBUG;

debug(`Starting ${DEBUG}`);

const app = new Koa();

// response
app.use((ctx, next) => {
  next().then(() => {
    ctx.status = 200;
    return delay();
  }).then(() => {
    return openFiles();
  }).then(() => {
    ctx.body = 'Hello Koa ES5';
  });
});

listenCb(app);
