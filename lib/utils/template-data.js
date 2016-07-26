import path from 'path';
import isNumber from 'lodash/isNumber';

export default function(config) {
  const {sources, utils} = config;
  const {scriptDir, srcDir, templateDir} = sources;
  const {addbase} = utils;

  function makeTemplatePath(dir) {
    return (fp) => `${addbase(srcDir, templateDir, dir, fp)}.html`;
  }

  function makeJSPath(dir) {
    return (fp) => `${path.join(srcDir, scriptDir, dir, fp)}.js`;
  }

  function join(...args) {
    //allow Number in filepath, must convert to String or `path.join` yells
    const normalizedArgs = args.map(arg => isNumber(arg) ? `${arg}` : arg);

    return path.join(...normalizedArgs);
  }

  return {
    join,
    headScripts: makeJSPath('head-scripts'),
    layouts: makeTemplatePath('layouts'),
    macros: makeTemplatePath('macros'),
    partials: makeTemplatePath('partials')
  };
}
