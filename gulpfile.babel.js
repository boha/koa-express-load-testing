import 'babel-polyfill';
import gulp from 'gulp';
import build from 'boiler-core';

const {tasks, config} = build(gulp);
const {environment, sources, utils} = config;
const {isDev, branch} = environment;
const {serverDir} = sources;
const {addbase} = utils;

gulp.task('babel', tasks.babel);
gulp.task('babel:dev', tasks.babel);
gulp.task('browser-sync', tasks.browserSync);
gulp.task('clean', tasks.clean);
gulp.task('copy', tasks.copy);
gulp.task('env', tasks.env);
gulp.task('lint:test', tasks.eslint);
gulp.task('lint:build', tasks.eslint);
gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
gulp.task('mocha', tasks.mocha);
gulp.task('nodemon', tasks.nodemon);

gulp.task('serve', !branch ? gulp.series(
  'nodemon',
  'browser-sync'
) : () => {});

gulp.task('watch:server', () => {
  gulp.watch([
    addbase(serverDir, '**/*.js'),
    '!' + addbase(serverDir, 'node_modules/**/*.js')
  ]).on('change', gulp.series('lint', 'babel:dev'));
});

gulp.task('server:dev', gulp.series(
  'lint',
  'babel:dev',
  'watch:server'
));

const run = () => {
  let task;

  if (isDev) {
    task = gulp.series(
      'clean',
      'lint',
      'serve'
    );
  } else {
    task = gulp.series(
      'clean',
      'lint',
      gulp.parallel('copy', 'env', 'babel')
    );
  }

  return task;
};

gulp.task('build', run());
gulp.task('default', gulp.series('build'));
gulp.task('watch', gulp.series('build', 'watch:server'));
