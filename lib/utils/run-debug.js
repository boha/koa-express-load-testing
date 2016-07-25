/**
 * File intentionally written in es5 because it is sometimes
 * required before `babel-register`
 */
const path = require('path');
const _debug = require('debug');
const bunyan = require('bunyan');
const isPlainObject = require('lodash/isPlainObject');
const name = process.env.DEBUG;
const base = (fp) => path.join(process.cwd(), fp);
let log;

if (process.env.NODE_ENV === 'production') {
  const logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: 'warn',
        path: base(`${name}-warn.log`)  // log WARN and above to a file
      },
      {
        level: 'error',
        path: base(`${name}-error.log`)  // log ERROR and above to a file
      },
      {
        level: 'info',
        stream: process.stdout            // log INFO and above to stdout
      }
    ]
  });
  log = (data) => {
    if (isPlainObject(data)) {
      const methods = ['info', 'warn', 'error'];

      Object.keys(data).forEach(key => {
        const val = data[key];

        if (methods.includes(key)) logger[key](val);
        else logger.warn(val);
      });
    } else {
      logger.warn(data);
    }
  };
} else {
  const logger = log = _debug(
    process.env.SERVER_ENTRY
  );

  logger.log = console.log.bind(console, '\nDEBUG:');

  log = (data) => {
    if (isPlainObject(data)) {
      Object.keys(data).forEach(key => {
        const val = data[key];

        logger(val);
      });
    } else {
      logger(data);
    }
  };
}

exports.debug = log;
