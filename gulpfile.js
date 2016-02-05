'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var lazypipe = require('lazypipe');
var del = require('del');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

var yeoman = {
  app: require('./bower.json').appPath || 'src',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/**/*.js', '!' + yeoman.app + '/templates.min.js'],
  styles: [yeoman.app + '/**/*.scss'],
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/**/*.html', '!' + yeoman.app + '/index.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var runStyles = function() {
  return gulp.src(yeoman.app + '/**/app.scss')
    .pipe($.sass({
      includePaths: require('node-neat').includePaths,
      outputStyle: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.flatten())
    .pipe(gulp.dest('.tmp/app'));
};

var concatenateTemplates = function() {
  return gulp.src(paths.views.files)
    .pipe($.ngTemplates({
      module: 'apachesolrAngularjsSearch',
      path: function(path, base) {
        return path.replace(base, '/apachesolr_angularjs_search/src/');
      },
      standalone: false,
    }))
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.app));
};

///////////
// Tasks //
///////////

gulp.task('styles', runStyles);

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function () {
  return del('./.tmp');
});

gulp.task('watch', function () {
  $.watch(paths.styles, function() {
    runStyles();
  })
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.views.files, function() {
    concatenateTemplates();
  })
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  gulp.watch('bower.json', ['bower']);
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..'
    }))
    .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function () {
  return del('./dist');
});

gulp.task('client:build', ['html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true, processImport: false}))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', concatenateTemplates);

gulp.task('build', ['clean:dist'], function () {
  runSequence(['client:build']);
});

gulp.task('default', ['build']);
