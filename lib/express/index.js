import express from 'express';
import {debug} from '../utils/run-debug';
import listenCb from '../utils/listen-cb';
import {delay, openFiles} from '../utils/log-commands';
import makeRender from '../utils/renderer';

const {DEBUG} = process.env;

debug(`Starting ${DEBUG}`);

const {render} = makeRender();
const app = express();

app.use((req, res, next) => {
  req.start = new Date();

  delay().then(() => {
    return openFiles();
  }).then(next);
});

app.get('/:type', (req, res, next) => {
  const {type} = req.params;
  const [split] = type.split('-').slice(-1);
  const data = {
    title: 'home',
    message: 'Hello Express ES6'
  };
  const fp = 'index';
  const opts = {
    type
  };

  if (split === 'basic') {
    //use assemble without boiler config
    opts.basic = true;
  }

  render(fp, data, opts).then(html => {
    debug({
      warn: {
        TOTAL_DURATION: new Date() - req.start
      }
    });
    res.status(200);
    res.send(html);
  }).catch(err => {
    res.status(404);
  });
});

listenCb(app);
