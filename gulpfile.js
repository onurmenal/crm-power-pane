var gulp = require('gulp'),
    argv = require('yargs').argv,
    sass = require('gulp-sass'),
    sassVariables = require('gulp-sass-variables'),
    webpack = require('webpack-stream'),
    fs = require('fs'),
    manifestBuilder = require('./src/js/util/manifest-builder');

var supportedTargets = ['chrome', 'firefox'];
if(supportedTargets.indexOf(argv.target) === -1) {
    console.error(`Target "${argv.target}" is not supported. Please use one of the following targets: ${supportedTargets.join(', ')}. Example usage: gulp [task-name] --target=chrome`);
    process.exit();
}

gulp.task('sass-ui', function(){
    return gulp.src('src/sass/ui/*.scss')
        .pipe(sassVariables({
            $target: argv.target
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`dist/${argv.target}/ui/css`));
});

gulp.task('js-ui', function () {
    return gulp.src(['src/js/ui/*.js', 'src/assets/lib/*.js'])
        .pipe(gulp.dest(`dist/${argv.target}/ui/js`));
});

gulp.task('html-ui', function () {
    return gulp.src(['src/html/ui/*.htm?(l)'])
        .pipe(gulp.dest(`dist/${argv.target}/ui`));
});

gulp.task('img', function () {
    return gulp.src(['src/assets/img/**/*'])
        .pipe(gulp.dest(`dist/${argv.target}/img`));
});

gulp.task('js', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(gulp.dest(`dist/${argv.target}/js`));
});

gulp.task('manifest', ['ui', 'img', 'js'], function (cb) {
    var manifest = manifestBuilder.build(argv.target);
    var manifestJson = JSON.stringify(manifest, null, 2);
    return fs.writeFile(`dist/${argv.target}/manifest.json`, manifestJson, cb)
});

gulp.task('ui', ['html-ui', 'js-ui', 'sass-ui']);
gulp.task('build', ['manifest', 'ui', 'img', 'js']);
gulp.task('default', ['build']);