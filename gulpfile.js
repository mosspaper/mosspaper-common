var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var ngAnnotate = require('gulp-ng-annotate');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

var sourceFiles = [

    // Make sure module files are handled first
    path.join(sourceDirectory, '/**/*.module.js'),

    // Then add all JavaScript files
    path.join(sourceDirectory, '/**/*.js')
];

var distPath = './dist/';
var devDistPath = '../mosspaper-app/bower_components/mosspaper-common/dist/';

var lintFiles = [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function () {
    gulp.src(sourceFiles)
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('mosspaper-common.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('mosspaper-common.min.js'))
        .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
    runSequence('jshint', 'test-src', 'build', done);
});

gulp.task('copy-to-bower', function(done) {
    gulp.src(distPath + '*.js')
        .pipe(gulp.dest(devDistPath));
});

/**
 * Watch task
 */
gulp.task('watch', function () {

    // Watch JavaScript files
    gulp.watch(sourceFiles, ['process-all']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
    return gulp.src(lintFiles)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint({expr: true}))
        .pipe(jshint.reporter(stylish));
        //.pipe(jshint.reporter(stylish))
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
    karma.start({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dist-concatenated.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
    karma.start({
        configFile: __dirname + '/karma-dist-minified.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', function () {
    runSequence('process-all', 'watch');
});

// gulp development
gulp.task('dev', function () {
    runSequence('process-all', 'copy-to-bower');
});

