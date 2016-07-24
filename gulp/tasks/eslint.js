export default function(gulp, plugins, config, {src}) {
  const {utils, sources, metaData} = config;
  const {testDir, serverDir} = sources;
  const {addbase, getTaskName} = utils;
  const task = getTaskName(metaData);

  switch (task) {
    case 'build':
      src.push(...[
        addbase(serverDir, '**/*.js'),
        '!' + addbase(serverDir, testDir, '**/*.js'),
        '!' + addbase(serverDir, 'node_modules/**/*.js')
      ]);
      break;
  }

  return {src};
}
