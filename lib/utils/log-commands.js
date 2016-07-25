const exec = require('child_process').exec;
const debug = require('./run-debug').debug;
const interval = process.env.INTERVAL;
let counter = -1;

exports.openFiles = () => {
  counter ++;

  if (counter % 100) return Promise.resolve();

  return new Promise((res, rej) => {
    exec('lsof | wc -l', (err, stdout, stderr) => {
      if (err) {
        debug({err: err});
        debug({error: stderr});
        return rej(err);
      }

      debug({warn: stdout});
      res();
    });
  });
};

exports.ulimit = () => {
  return new Promise((res, rej) => {
    exec('ulimit -n', (err, stdout, stderr) => {
      if (err) {
        debug({err: err});
        return rej(err);
      }

      debug({warn: stdout});
      debug({error: stderr});
      res();
    });
  });
};

exports.delay = () => {
  const d = isNaN(interval) ? 50 : +interval;

  if (d === 0) return Promise.resolve();

  return new Promise(res => setTimeout(res, d));
};
