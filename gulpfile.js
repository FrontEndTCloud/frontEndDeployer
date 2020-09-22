/**
 * @package FontEndDeployer
 * @since FontEndDeployer 1.0.1
 */

const autoPrefixer		= require('gulp-autoprefixer'),
			browserSync 		= require('browser-sync'),
			gulp 						= require('gulp'),
			gulpClean 			= require('gulp-clean'),
			gulpConcat 			= require('gulp-concat'),
			gulpCssNano 		= require('gulp-cssnano'),
			gulpImageMin 		= require('gulp-imagemin'),
			gulpSass 				= require('gulp-sass'),
			gulpUglifyEs 		= require('gulp-uglify-es').default,
			pngQuant 				= require('pngquant'),
			args 						= require('yargs').argv,
			gulpBabel 			= require('gulp-babel'),
			gulpMinify 			= require('gulp-minify')
			gulpCleanCss 		= require('gulp-clean-css')
			gulpRename 			= require('gulp-rename');

var options = {
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

	js: {
		folder: 'app/js',
		fileName: 'app.js',
	},

	img: {
		folder: 'app/img',
	},
};

/**
 * Production tasks
 */

/** @tag ES6ToES5 */
gulp.task('es6-to-es5', () => {
	let jsPath = `${options.prod.folder}/js/**/*.js`;

	return gulp.src(jsPath, options.src)
		.pipe(gulpBabel())
		.pipe(gulp.dest(`${options.prod.folder}/js`));
});

/** @tag Cleaner */
gulp.task('clean', () => {
	let path = (args.C)
		? args.C
		: `${options.prod.folder}/`;

	return gulp.src(path, { ...options.src, read: false })
		.pipe(gulpClean());
});

gulp.task('buildCss', () => {
	let cssPath = `${options.dev.folder}/css/**/*.css`;

	return gulp.src(cssPath, options.src)
		.pipe(gulp.dest(`${options.prod.folder}/css/`));
});

gulp.task('buildjs', () => {
	let jsPath = `${options.dev.folder}/js/**/*.js`;

	return gulp.src(jsPath, options.src)
		.pipe(gulp.dest(`${options.prod.folder}/js/`));
});

gulp.task('compresCss', () => {
	let jsPath = `${options.prod.folder}/css/**/*.css`;

	return gulp.src(jsPath, options.src)
		.pipe(gulpCleanCss({ debug: true }, (details) => {
			console.log(`${details.name}: ${details.stats.originalSize}`);
			console.log(`${details.name}: ${details.stats.minifiedSize}`);
		}))
		.pipe(gulpRename({suffix: '.min'}))
		.pipe(gulp.dest(`${options.prod.folder}/css/`));
});

gulp.task('compresJs', () => {
	let jsPath = `${options.prod.folder}/js/**/*.js`;

	return gulp.src(jsPath, options.src)
		.pipe(gulpBabel())
		.pipe(gulpMinify({
			ext: {
				min: '.min.js',
			},
		}))
		.pipe(gulp.dest(`${options.prod.folder}/js/`));
});

gulp.task('compresImages', () => {
	let imgPath = options.img.folder;

	return gulp.src(`${imgPath}/**/*`)
		.pipe(gulpImageMin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngQuant()],
			verbose: true,
		}))
		.pipe(gulp.dest(`${options.prod.folder}/img/`));
});

gulp.task('buildFonts', () => {
	return gulp.src(`${options.dev.folder}/fonts/**/*`, options.src)
		.pipe(gulp.dest(`${options.prod.folder}/fonts/`));
});

gulp.task('buildHtml', () => {
	return gulp.src(`${options.dev.folder}/**/*.html`, options.src)
		.pipe(gulp.dest(`${options.prod.folder}/`));
});

gulp.task('buildLibs', () => {
	return gulp.src(`${options.dev.folder}/libs/**/*`, options.src)
		.pipe(gulp.dest(`${options.prod.folder}/libs/`));
});

let buildTasks = [
	'clean',
	'buildCss', 'compresCss',
	'buildjs', 'es6-to-es5', 'compresJs',
	'compresImages',
	'buildFonts',
	'buildLibs',
	'buildHtml',
];

gulp.task('build', gulp.series([...buildTasks]));

/**
 * Development tasks
 */

/** @tag browserSync */
gulp.task('sync', function () {
	browserSync({
		server: {
			baseDir: `app`
		},
		notify: true
	});
});

/** @tag SassToCss */
gulp.task('sass-to-css', () => {
	let sassPath = `${options.dev.folder}/sass/${options.sass.fileName}`,
		cssPath = `${options.dev.folder}/css`;

	return gulp.src(sassPath, options.src)
		.pipe(gulpSass())
		.pipe(
			autoPrefixer(
				['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
				{ cascade: true }
			)
		)
		.pipe(gulpConcat(options.css.fileName))
		.pipe(gulp.dest(cssPath))
		.pipe(
			browserSync.reload(
				{ stream: true }
			)
		);
});

/** @tag HtmlWatcher */
gulp.task('html-watch', function() {
	return gulp.src(`${options.dev.folder}/*.html`)
		.pipe(
			browserSync.reload(
				{stream: true}
			)
		)
});

/** @tag JavaScriptWatcher */
gulp.task('javascript-watch', function() {
	return gulp.src(`${options.dev.folder}/js/**/*.js`)
		.pipe(
			browserSync.reload(
				{stream: true}
			)
		)
});

gulp.task('watch', () => {
	gulp.watch(
		[`${options.dev.folder}/sass/**/*.sass`],
		gulp.parallel(['sass-to-css'])
	);

	gulp.watch(
		[`${options.dev.folder}/**/*.html`],
		gulp.parallel(['html-watch'])
	);

	gulp.watch(
		[`${options.dev.folder}/**/*.js`],
		gulp.parallel(['javascript-watch'])
	);

	console.log('======================================');
	console.log('========= Watching is running ========');
	console.log('======================================');
});

gulp.task('dev-watch', gulp.parallel('sass-to-css', 'watch', 'sync'));