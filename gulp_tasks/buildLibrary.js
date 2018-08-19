const gulp = require('gulp');
const inline_Css = require('gulp-inline-css');
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const angularTemplatecache = require('gulp-angular-templatecache');
const del = require('del');

const conf = require('../conf/gulp.conf');

gulp.task('concatJsLibrary', concatJsLibrary);
gulp.task('moveLibToDist', moveLibToDist)

gulp.task('tmpLibrary', gulp.series(inlineCss, partialsLibrary, moveLibToTmp, concatJsLibrary));

function moveLibToTmp() {
    return gulp.src(conf.path.src('*.js'))
        .pipe(gulp.dest(conf.path.tmp()));
}

function concatJsLibrary() {
    // moveLibToTmp();
    return gulp.src(conf.path.tmp('*.js'))
        //.pipe(sourcemaps.init())
        .pipe(concat('angularJsDynamicTable.js'))
        //.pipe(uglify()).pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.path.tmp()))
        .on('end', function () {
            del([
                conf.path.tmp('tableController.js'),
                conf.path.tmp('templateCacheHtmlLib.js')
            ]);
        });
}

function moveLibToDist() {
    return gulp.src(conf.path.tmp('angularJsDynamicTable.js'))
        .pipe(gulp.dest(conf.path.dist('/lib')));
}

function partialsLibrary() {
    return gulp.src(conf.path.tmp('**/*.html'))
        //.pipe(htmlmin(conf.htmlmin))
        .pipe(angularTemplatecache('templateCacheHtmlLib.js', {
            module: 'angularTable',
            root: ''
        }))
        .pipe(gulp.dest(conf.path.tmp()))
        .on('end', function () {
            del([
                conf.path.tmp('table.html')
            ]);
        });
}

function inlineCss() {
    var stylesheet = fs.readFileSync(conf.path.src('table.css'), 'utf8');
    return gulp.src(conf.path.src('**/*.html'))
        .pipe(inline_Css({
            extraCss: stylesheet
        }))
        .pipe(gulp.dest(conf.path.tmp()));
}