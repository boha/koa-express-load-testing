const express = require('express');
const debug = require('./utils/run-debug').debug;
const listenCb = require('./utils/listen-cb-es5');
const cmds = require('./utils/log-commands');
const openFiles = cmds.openFiles;
const delay = cmds.delay;

const DEBUG = process.env.DEBUG;

debug(`Starting ${DEBUG}`);

const app = express();

app.use((req, res, next) => {
  delay().then(() => {
    return openFiles();
  }).then(() => {
    res.status(200);
    res.send('Hello Express ES5');
    next();
  });
});

listenCb(app);
