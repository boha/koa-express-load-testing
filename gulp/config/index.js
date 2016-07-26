// Libraries
import path from 'path';
import merge from 'lodash/merge';
import serverConfig from '../../lib/config';

export default {
  browserSync: {
    open: true
  },
  babel(config, babelConfig) {
    const {sources, utils} = config;
    const {testDir, syncDir, serverDir} = sources;
    const {addbase} = utils;
    const src = [
      addbase(serverDir, '**/*.js'),
      '!' + addbase(serverDir, testDir, '**/*.js'),
      '!' + addbase(serverDir, 'node_modules', '**/*.js')
    ];
    const dest = addbase(syncDir, serverDir);

    babelConfig.endpoints = [
      {src, dest}
    ];

    babelConfig.babelrc = {};

    return babelConfig;
  },
  copy(config, copyConfig) {
    const {sources, utils} = config;
    const {serverDir, syncDir, srcDir, templateDir} = sources;
    const {addbase} = utils;

    copyConfig.endpoints = [
      {
        src: addbase(srcDir, templateDir, '**/*'),
        dest: addbase(syncDir, srcDir, templateDir)
      },
      {
        src: addbase('package.json'),
        dest: addbase(syncDir)
      },
      {
        src: addbase(serverDir, '**/*.json'),
        dest: addbase(syncDir, serverDir)
      }
    ];

    return copyConfig;
  },
  mocha: {
    require: path.resolve(__dirname, 'babel-hook.js')
  },
  nodemon(config, nodemonConfig) {
    const {sources, environment, utils, ENV} = config;
    const {syncDir, serverDir} = sources;
    const {isDev} = environment;
    const {addbase} = utils;
    const entryI = process.argv.indexOf('--entry');
    const [serverEntry] = entryI > -1 ? process.argv.slice(entryI + 1, entryI + 2) : ['koa'];
    const entry = path.basename(serverEntry, path.extname(serverEntry));
    const intervalI = process.argv.indexOf('--int');
    const [interval] = intervalI > -1 ? process.argv.slice(intervalI + 1, intervalI + 2) : ['50'];

    return merge({}, nodemonConfig, {
      script: path.join(serverDir, 'index.js'),
      env: {
        INTERVAL: interval,
        DEBUG: entry,
        NODE_ENV: ENV,
        SERVER_ENTRY: entry,
        WORKERS: 4
      },
      cwd: isDev ? process.cwd() : addbase(syncDir)
    });
  },
  /**
   * Options for eslint
   * https://www.npmjs.com/package/eslint-config
   */
  eslint: {
    basic: false,
    react: true,
    generate: true
  },
  /**
   * Modify the gulp config after construction but before running tasks
   */
  cb(config) {
    //you have access to the gulp config here for
    //any extra customization after merging  => don't forget to return config
    return merge(config, serverConfig);
  }
};
