/**
 * File intentionally written in es5 because it is sometimes
 * required before `babel-register`
 */
const _debug = require('debug');
const renameKey = require('boiler-utils').renameKey;

const filename = module.parent && module.parent.filename;
const debugName = renameKey(filename);
const log = _debug(
  process.env.SERVER_ENTRY
);

log.log = console.log.bind(console, '\nDEBUG:');
log(`LOADING ${debugName}`);

//delete from require.cache so see logging of every file loading
delete require.cache[__filename];

exports.debug = log;
