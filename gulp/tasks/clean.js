export default function(gulp, plugins, config, {src}) {
  const {sources, utils} = config;
  const {syncDir} = sources;
  const {addbase} = utils;

  src.push(
    addbase(syncDir)
  );

  return {src};
}
