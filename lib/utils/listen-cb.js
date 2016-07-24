import {sources} from '../config';

export default function(app) {
  const {debug} = require('./run-debug');
  const {serverPort: port = 3000} = sources;

  app.listen(port, (err) => {
    const {OPEN} = process.env;

    if (err) {
      debug('[server: entry] error in `app.listen`');

      return console.error(err.message, err.stack);
    }

    if (OPEN) {
      process.stdout.write(OPEN);
    }

    debug(`[server: entry] server listening ${port}`);
  });
}
