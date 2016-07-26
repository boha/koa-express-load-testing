import express from 'express';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay} from '../utils/log-commands';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const app = express();

app.use(async (req, res, next) => {
  const start = new Date();

  await delay();

  debug({
    warn: {
      duration: new Date() - start
    }
  });
  res.status(200);
  res.send('Hello Express ES7');
  next();
});

listenCb(app);
