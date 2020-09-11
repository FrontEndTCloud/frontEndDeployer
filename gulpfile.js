/**
 * @package FontEndDeployer
 * @since FontEndDeployer 1.0.1
 */

var autoPrefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    gulp = require('gulp'),
    gulpClean = require('gulp-clean'),
    gulpConcat = require('gulp-concat'),
    gulpCssNano = require('gulp-cssnano'),
    gulpImageMin = require('gulp-imagemin'),
    gulpSass = require('gulp-sass'),
    gulpUglifyEs = require('gulp-uglify-es').default,
    pngQuant = require('pngquant'),
    args = require('yargs').argv;
  
const options = {
    dev: {
        folder: 'app',
    },

    prod: {
        folder: 'dist',
    },

    src: {
        allowEmpty: true,
    },

    css: {
        fileName: 'app.css',
    },

    sass: {
        fileName: 'app.sass',
    },
};

/**
 * Production tasks
 */

/**
 * ...
 */

/**
 * Development tasks
 */

gulp.task('args', () => {
    console.log(args);
});

/** @tag SassToCss */
gulp.task('sass-to-css', function () {
    let sassPath = `${options.dev.folder}/sass/${options.sass.fileName}`,
        cssPath = `${options.dev.folder}/css`;

	return gulp.src(sassPath, options.src)
		.pipe(gulpSass())
		.pipe(
            autoPrefixer(
                [ 'last 15 versions', '> 1%', 'ie 8', 'ie 7' ],
                {cascade: true}
            )
        )
		.pipe(gulpConcat(options.css.fileName))
        .pipe(gulp.dest(cssPath))
		.pipe(
            browserSync.reload(
                {stream: true}
            )
        );
});

/** @tag browserSync */
gulp.task('sync', function() {
    browserSync({
        server:{
            baseDir: `${options.dev.folderName}/`
        },
        notify: false
    });
});

/** @tag Cleaner */
gulp.task('clean', () => {
    let path = (args.C)
        ? args.C
        : `${options.prod.folder}/`;

    return gulp.src(path, {...options.files, read: false})
        .pipe(gulpClean());
});
