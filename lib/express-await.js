import express from 'express';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';
import {openFiles} from './utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = express();

app.use(async (req, res, next) => {
  await Promise.resolve();
  openFiles();
  res.send('Hello Express ES7');

  next();
});

listenCb(app);
