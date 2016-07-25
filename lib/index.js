const path = require('path');
const fs = require('fs');
const envFile = path.resolve(__dirname, '..', '.env');

try {
  const stat = fs.statSync(envFile);

  if (stat.isFile()) {
    require('dotenv').load({
      path: envFile,
      encoding: 'utf8',
      silent: false
    });
  }
} catch (err) {
  //dev mode
}

const getUlimit = require('./utils/log-commands').ulimit;
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'development') {
  require('babel-register');
} else if (NODE_ENV === 'production') {
  process.chdir('./server');
}

require('babel-polyfill');
global.Promise = require('babel-runtime/core-js/promise').default = require('bluebird');

getUlimit();

require(
  path.resolve(__dirname, process.env.SERVER_ENTRY)
);
