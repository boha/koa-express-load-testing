const exec = require('child_process').exec;
const debug = require('./run-debug').debug;
let counter = 0;

exports.openFiles = function() {

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

exports.ulimit = function() {
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
