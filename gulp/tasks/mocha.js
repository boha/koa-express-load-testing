import path from 'path';

export default function(gulp, plugins, config, {src}) {
  const {serverDir, testDir} = config.sources;
  const normalizedTestDir = testDir.replace(/\.?\//g, '');
  const newSrc = src.map(fp => {
    return fp.replace(normalizedTestDir, path.join(serverDir, testDir));
  });

  return {
    src: newSrc
  };
}
