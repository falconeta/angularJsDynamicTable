const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const angularTemplatecache = require('gulp-angular-templatecache');

const conf = require('../conf/gulp.conf');

gulp.task('buildLibrary', build);
gulp.task('partialsLibrary', partialsLibrary)


function build() {
    return gulp.src(conf.path.src('tableController.js'))
    .pipe(gulp.dest(conf.path.dist()));
}

function partialsLibrary() {
    return gulp.src(conf.path.src('**/*.html'))
      .pipe(htmlmin(conf.htmlmin))
      .pipe(angularTemplatecache('templateCacheHtml.js', {
        module: 'angularTable',
        root: ''
      }))
      .pipe(gulp.dest(conf.path.dist()));
  }
  