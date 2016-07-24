const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require('babel-register');
}

require('babel-polyfill');
global.Promise = require('babel-runtime/core-js/promise').default = require('bluebird');

require(
  path.resolve(__dirname, process.env.SERVER_ENTRY)
);
