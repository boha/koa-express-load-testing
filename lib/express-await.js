import express from 'express';
import {debug} from './utils/run-debug';
import listenCb from './utils/listen-cb';
import {delay, openFiles} from './utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = express();

app.use(async (req, res, next) => {
  await delay();
  await openFiles();
  res.status(200);
  res.send('Hello Express ES7');
  next();
});

listenCb(app);
