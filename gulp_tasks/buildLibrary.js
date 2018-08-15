const gulp = require('gulp');
const inline_Css = require('gulp-inline-css');
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const angularTemplatecache = require('gulp-angular-templatecache');

const conf = require('../conf/gulp.conf');

gulp.task('buildLibrary', build);
gulp.task('partialsLibrary', partialsLibrary);
gulp.task('concatJsLibrary', concatJsLibrary);
gulp.task('inlineCss', inlineCss);


function build() {
    return gulp.src(conf.path.src('*.js'))
        .pipe(gulp.dest(conf.path.tmp()));
}

function concatJsLibrary() {
    return gulp.src(conf.path.tmp('*.js'))
        //.pipe(sourcemaps.init())
        .pipe(concat('angularJsDynamicTable.js'))
        //.pipe(uglify()).pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.path.dist()));
}

function partialsLibrary() {
    return gulp.src(conf.path.tmp('**/*.html'))
        //.pipe(htmlmin(conf.htmlmin))
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: 'angularTable',
            root: ''
        }))
        .pipe(gulp.dest(conf.path.tmp()));
}

function inlineCss() {
    var stylesheet = fs.readFileSync(conf.path.src('table.css'), 'utf8');
    return gulp.src(conf.path.src('**/*.html'))
        .pipe(inline_Css({
            extraCss: stylesheet
        }))
        .pipe(gulp.dest(conf.path.tmp()));
}