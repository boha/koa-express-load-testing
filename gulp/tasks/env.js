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

    const entryI = process.argv.indexOf('--entry');
    const [serverEntry] = entryI > -1 ? process.argv.slice(entryI + 1, entryI + 2) : ['koa'];
    const entry = path.basename(serverEntry, path.extname(serverEntry));

    return new Promise((res, rej) => {
      writeFile(
        addbase(syncDir, '.env'),
        [
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
