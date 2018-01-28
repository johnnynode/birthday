//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var order = require("gulp-order");
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin'); // 压缩图片
var htmlmin = require('gulp-htmlmin'); // 压缩html
var htmlreplace = require('gulp-html-replace');
var stripDebug = require('gulp-strip-debug'); // Strip console, alert, and debugger statements
var uglify = require('gulp-uglify'); // 压缩js
var del = require('del'); // 清空文件和文件夹
var sh = require('shelljs');
var process = require('process');
open = require('gulp-open');

// 需要监控的路径
var srcPath = './src';
var distPath = './dist';

var platform = process.platform, // 判断操作系统
    // 定义一组browser的判断
    browser = platform === 'linux' ? 'google-chrome' : (
    platform === 'darwin' ? 'google chrome' : (
        platform === 'win32' ? 'chrome' : 'firefox')),
    // 定义标识
    connectFlag = 0, // 用于控制connect任务中的root路径
    portFlag = 0; // 用于控制端口不同

// 使用connect启动一个Web服务器
gulp.task('connect', function () {
  var root = connectFlag ? distPath : srcPath;
  var hostname = '127.0.0.1';
  connect.server({
    root: root,
    fallback: root + '/index.html',
    livereload: {
      hostname: hostname,
      enable: true,
      port: portFlag ? 36000 : 35729
    },
    port: portFlag ? 8000 : 9000,
    middleware: function (connect, opt) {
      return []
    }
  });
});

gulp.task('watch', function () {
  gulp
    .src(srcPath)
    .pipe(plumber())
    .pipe(watch(srcPath))
    .pipe(connect.reload());
});

// 打开浏览器的任务
gulp.task('open', function() {
  // gulp-open 的选项
  var browserOptions = {
      uri: 'http://localhost:' + (portFlag ? '8000' : '9000'), 
      app: browser
  };
  gulp.src(srcPath)
      .pipe(open(browserOptions));
});

// clean task
gulp.task('clean', function () {
  return del([distPath + '/**/*']);
});

// css task including sass
gulp.task('css', function () {
  return gulp
    .src(srcPath + '/css/**/*')
    .pipe(plumber())
    .pipe(cleanCSS({rebase: false}))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest(distPath + '/css'));
});

// imagemin images and output them in dist
gulp.task('image', function () {
  return gulp
    .src(srcPath + '/images/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(distPath + '/images'));
});

// js task
gulp.task('js', function () {
  return gulp
    .src([srcPath + '/js/**/*'])
    .pipe(plumber())
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(order([
      "jweixin-1.0.0.js",
      "threeCanvas.js",
      "snow.js",
      "scene.js",
      "cake.js",
      "music.js",
    ]))
    .pipe(concat('app.bundle.min.js'))
    .pipe(gulp.dest(distPath + '/js'));
});

gulp.task('audio', function () {
  return gulp
    .src(srcPath + '/audio/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(distPath + '/audio'));
});

// prepare Index.html for dist - ie. using min files
gulp.task('index', function () {
  return gulp
    .src(srcPath + '/index.html')
    .pipe(plumber())
    .pipe(htmlreplace({'css': 'css/app.min.css', 'js': 'js/app.bundle.min.js'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(distPath + '/.'));
});

//运行Gulp时,搭建起跨域服务器
gulp.task('server', function () {
  connectFlag = 0;
  portFlag = 0;
  runSequence(['connect', 'watch', 'open']);
});

// 构建任务
var production = ['audio', 'image', 'css', 'js', 'index'];

// 构建任务
gulp.task('build', ['clean'], function () {
  return runSequence(production, function () {
    sh.echo('🚂🚂🚂 构建完毕！');
  });
});

// 构建完成 搭建起基于构建后的服务器
gulp.task('build-server', function () {
  connectFlag = 1;
  portFlag = 1;
  runSequence(['connect', 'open']);
});