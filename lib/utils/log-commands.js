const exec = require('child_process').execSync;
const debug = require('./run-debug').debug;

exports.openFiles = function() {
  debug(
    `***FILES OPEN: ${exec('lsof | wc -l').toString().trim()}****`
  );
};

exports.ulimit = function() {
  debug(
    `***ULIMIT: ${exec('ulimit -n').toString().trim()}****`
  );
};
