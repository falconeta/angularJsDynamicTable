const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');
const del = require('del');

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('cleanDistTmp', cleanDistTmp);
gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
gulp.task('build:example', gulp.series('cleanDistTmp', 'tmpLibrary', 'partials', gulp.parallel('inject', 'other'), 'build'));
gulp.task('build:lib', gulp.series('cleanDistTmp', 'tmpLibrary', 'moveLibToDist'));
gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
gulp.task('serve:example', gulp.series('cleanDistTmp', 'tmpLibrary', 'inject', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch([conf.path.example('index.html'), 'bower.json'], gulp.parallel('inject'));
  gulp.watch(conf.path.example('**/*.scss'), gulp.series('sass'));
  gulp.watch(conf.path.example('**/*.html'), gulp.series('partials', reloadBrowserSync));
  gulp.watch([conf.path.example('**/*.css')], gulp.series('styles'));
  gulp.watch(conf.path.example('**/*.js'), gulp.series('inject'));

  gulp.watch([
    conf.path.src('**/*.js'),
    conf.path.src('**/*.html'),
    conf.path.src('**/*.scss')
  ], gulp.series('sassLibrary', 'cleanDistTmp', 'tmpLibrary', 'inject',  reloadBrowserSync));
  done();
}

function cleanDistTmp() {
  return del([conf.path.tmp(), conf.path.dist()]);
}