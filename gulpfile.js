const gulp = require('gulp');
const sass=require('gulp-sass');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');



gulp.task('sass',function(){
    return gulp.src('./src/app/**/*scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/app'));
});

const conf = require('./conf/gulp.conf');

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('inject', gulp.series(gulp.parallel('styles', 'scripts'), 'inject'));
gulp.task('build', gulp.series('partials', gulp.parallel('inject', 'other'), 'build'));
gulp.task('buildLibrary', gulp.series('inlineCss', 'partialsLibrary', 'buildLibrary', 'concatJsLibrary'));
gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
gulp.task('serve', gulp.series('inject', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
  browserSync.reload();
  cb();
}

function watch(done) {
  gulp.watch([
    conf.path.example('index.html'),
    'bower.json'
  ], gulp.parallel('inject'));
  gulp.watch(conf.path.example('**/*.scss'), gulp.series('sass'));

  gulp.watch(conf.path.example('app/**/*.html'), gulp.series('partials', reloadBrowserSync));
  gulp.watch([
    conf.path.example('**/*.css')
  ], gulp.series('styles'));
  gulp.watch(conf.path.example('**/*.js'), gulp.series('inject'));
  done();
}
