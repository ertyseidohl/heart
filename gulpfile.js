var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var browserify = require('browserify')

gulp.task(
	'clean',
	function () {
		del('./dest');
		del('./temp');
		return true;
	}
);

gulp.task(
	'files', ['clean'],
	function () {
		return gulp
			.src([
				'./src/**/*.html',
				'./src/**/*.css'
			])
			.pipe(gulp.dest('./dest/'))
	}
);

gulp.task(
	'ts',
	['clean'],
	function () {
		var tsResult = gulp.src('./src/**/*.ts')
			.pipe(sourcemaps.init())
			.pipe(ts({
				sortOutput: true,
				module: "commonjs",
				noEmitOnError: true,
				moduleResolution: 'node'
			}))

		return tsResult.js
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./temp/'));
	}
);

gulp.task(
	'default',
	['clean', 'ts', 'files', 'browserify']
);

gulp.task(
	'browserify',
	['clean', 'ts'],
	function() {
		var b = browserify({
			entries: './temp/main.js',
			debug: true
		});

		return b.bundle()
			.pipe(source('script.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('./dest/'));
	}
)

gulp.task(
	'watch',
	function () {
		watch([
			'src/**/*',
			'index.html',
			'gulpfile.js'
		],
		function (events) {
			gulp.start('default');
		});
	}
);
