import express from 'express';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';
import {openFiles, delay} from './utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = express();

app.use((req, res, next) => {
  delay().then(() => {
    return openFiles();
  }).then(() => {
    res.status(200);
    res.send('Hello Express ES6');
    next();
  });
});

listenCb(app);
