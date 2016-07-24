import babelrc from './babelrc';

/**
 * Hack to double require `babel-register` and add `rewire` for tests
 */
require('babel-register')({
  ...babelrc,
  plugins: [
    'rewire',
    ...babelrc.plugins
  ]
});

global.Promise = require('babel-runtime/core-js/promise').default = require('bluebird');

Promise.config({
  warnings: false,
  longStackTraces: true,
  cancellation: true
});
