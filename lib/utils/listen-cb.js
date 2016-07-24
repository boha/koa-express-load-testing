export default function(port) {
  return (err) => {
    const {debug} = require('./run-debug');
    const {OPEN} = process.env;

    if (err) {
      debug('[server: entry] error in `app.listen`');

      return console.error(err.message, err.stack);
    }

    if (OPEN) {
      process.stdout.write(OPEN);
    }

    debug(`[server: entry] server listening ${port}`);
  };
}
