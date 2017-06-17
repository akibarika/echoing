// Load plugins
var
    gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    plumber = require('gulp-plumber');


var env = process.env.NODE_ENV || 'development';

var onError = function (err) {
    notify.onError(function (error) {
        return 'Error compiling: ' + error.message;
    })(err);

    this.emit('end');
};

// Base paths
var paths = {
    src: './wp-content/themes/echoing/src/',
    dest: './wp-content/themes/echoing/'
};

// CSS
gulp.task('css', ['clean-css'], function () {
    return gulp
        .src(paths.src + 'scss/echoing-main.scss')
        .pipe(plumber({
            errorHandler: onError
        }))

        .pipe(gulpif(env === 'development', sass({
            //includePaths: ['styles'].concat(neat)
        })))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))

        .pipe(gulpif(env === 'production', sass({errLogToConsole: true})))
        .pipe(gulpif(env === 'production', minifycss()))
        .pipe(gulp.dest(paths.dest + 'css'))
        .pipe(livereload());
});

gulp.task('clean-css', function () {
    del(['css/echoing-main.scss'], {cwd: paths.dest});
});

// Default task
gulp.task('default', ['css']);

// Watch
gulp.task('watch', ['default'], function () {

    // Watch .less files
    gulp.watch([paths.src + 'scss/**/*.scss'], ['css']);
    // Create LiveReload server
    livereload.listen();
    // Watch any files in , reload on change
    gulp.watch([
        paths.dest + 'css/*.css'
    ]).on('change', livereload.changed);

});
