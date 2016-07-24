const sources = require('../config').sources;

module.exports = function(app) {
  const debug = require('./run-debug').debug;
  const port = sources.serverPort || 3000;

  app.listen(port, (err) => {
    const OPEN = process.env.OPEN;

    if (err) {
      debug('[server: entry] error in `app.listen`');

      return console.error(err.message, err.stack);
    }

    if (OPEN) {
      process.stdout.write(OPEN);
    }

    debug(`[server: entry] server listening ${port}`);
  });
};
