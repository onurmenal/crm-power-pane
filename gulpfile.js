var gulp = require('gulp'),
    argv = require('yargs').argv,
    sass = require('gulp-sass'),
    sassVariables = require('gulp-sass-variables'),
    webpack = require('webpack-stream'),
    fs = require('fs'),
    manifestBuilder = require('./src/js/util/manifest-builder');

var supportedTargets = require('./build/targets');
if(supportedTargets.indexOf(argv.target) === -1) {
    console.error(`Target "${argv.target}" is not supported. Please use one of the following targets: ${supportedTargets.join(', ')}. Example usage: gulp [task-name] --target=chrome`);
    process.exit();
}

var buildVersion = argv.buildVersion;
if(typeof buildVersion === 'undefined' || buildVersion === null || buildVersion === "") {
    buildVersion = require('./package.json').version;
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

    // Copy API Bridges
    if(argv.target == 'edge') {
        gulp.src(['src/assets/lib/edge/*.js'])
            .pipe(gulp.dest(`dist/${argv.target}`));
    }
    
    return gulp.src(['src/js/*.js'])
        .pipe(gulp.dest(`dist/${argv.target}/js`));
});

gulp.task('ui', gulp.series(gulp.parallel('html-ui', 'js-ui', 'sass-ui')));

gulp.task('manifest', gulp.series(gulp.parallel('ui', 'img', 'js'), function (cb) {
    var manifest = manifestBuilder.build(argv.target, buildVersion);
    var manifestJson = JSON.stringify(manifest, null, 2);
    return fs.writeFile(`dist/${argv.target}/manifest.json`, manifestJson, cb)
}));

gulp.task('build', gulp.series(gulp.parallel('manifest', 'ui', 'img', 'js')));
gulp.task('default', gulp.series('build'));