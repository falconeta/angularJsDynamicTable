const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

gulp.task('sassLibrary', sassLibrary);
gulp.task('sass', sassExample);

function styles() {
  return gulp.src(conf.path.example('**/*.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}

function sassLibrary() {
  return gulp.src(conf.path.src('**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(conf.path.src()));
}

function sassExample() {
  return gulp.src(conf.path.example('**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(conf.path.example()));
}