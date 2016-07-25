const express = require('express');
const debug = require('./utils/run-debug').debug;
const listenCb = require('./utils/listen-cb-es5');
const openFiles = require('./utils/log-commands').openFiles;

const DEBUG = process.env.DEBUG;

debug(`Starting ${DEBUG}`);

const app = express();

app.use((req, res, next) => {
  openFiles().then(() => {
    res.status(200);
    res.send('Hello Express ES5');
    next();
  });
});

listenCb(app);
