import path from 'path';
import {cpus} from 'os';
import {outputFile as writeFile} from 'fs-extra';

export default function(gulp, plugins, config) {
  const {environment, sources, utils} = config;
  const {syncDir} = sources;
  const {addbase} = utils;
  const {isDev} = environment;

  return () => {
    if (isDev) return Promise.resolve();

    const {INT} = process.env;
    const entryI = process.argv.indexOf('--entry');
    const [serverEntry] = entryI > -1 ? process.argv.slice(entryI + 1, entryI + 2) : ['koa'];
    const entry = path.basename(serverEntry, path.extname(serverEntry));
    let interval = INT;

    if (!interval) {
      const intervalI = process.argv.indexOf('--int');
      interval = intervalI > -1 ? process.argv.slice(intervalI + 1, intervalI + 2)[0] : 50;
    }

    return new Promise((res, rej) => {
      writeFile(
        addbase(syncDir, '.env'),
        [
          `INTERVAL=${interval}`,
          `DEBUG=${entry}`,
          'NODE_ENV=production',
          `SERVER_ENTRY=${entry}`,
          `WORKERS=${cpus().length}`
        ].join('\n'),
        (err) => err ? rej(err) : res()
      );
    });
  };
}
