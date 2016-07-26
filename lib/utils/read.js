import path from 'path';
import async from 'async';
import {readJson} from 'fs-extra';

export default function(fps) {
  const base = (fp) => path.resolve(__dirname, '..', 'mocks', `${fp}.json`);
  const defaultFiles = [
    'one',
    'two',
    'three',
    'four'
  ].map(base);

  return new Promise((res, rej) => {
    async.map(fps || defaultFiles, readJson, (err, results) => {
      if (err) return rej(err);

      const json = results.reduce((acc, data) => ({
        ...acc,
        ...data
      }), {});

      res(json);
    });
  });
}
