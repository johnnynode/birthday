//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin'); // 压缩图片
var htmlmin = require('gulp-htmlmin'); // 压缩html
var htmlreplace = require('gulp-html-replace');
var stripDebug = require('gulp-strip-debug'); // Strip console, alert, and debugger statements
var uglify = require('gulp-uglify'); // 压缩js
var del = require('del'); // 清空文件和文件夹
var sh = require('shelljs');
var process = require('process');

// 需要监控的路径
var srcPath = './src';
var distPath = './dist';

// 使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: './src',
        livereload: true,
        port: 9000,
        middleware: function (connect, opt) {
            return [
            ]
        }
    });
});

gulp.task('watch', function () {
    gulp.src(srcPath)
        .pipe(plumber())
        .pipe(watch(srcPath))
        .pipe(connect.reload());
});

// 打开浏览器
gulp.task('open-browser', function () {
    var platform = process.platform;
    var shellStr1 = "open -a '/Applications/Google Chrome.app' 'http://localhost:9000'";
    var shellStr2 = "start http://localhost:9000";
    // 打开浏览器方法：
    var openFunc = function (str, flag) {
        // 执行并对异常处理
        if (sh.exec(str).code !== 0) {
            sh.echo(flag + '下打开浏览器失败,建议您安装chrome并设为默认浏览器!');
            sh.exit(1);
        }
    };
    if (platform === 'darwin') {
        openFunc(shellStr1, 'Mac');
    } else if (platform === 'win32' || platform === 'win64') {
        openFunc(shellStr2, 'Windows');
    } else {
        sh.echo('现在只支持Mac和windows系统!如果未打开页面，请确认安装chrome并设为默认浏览器!');
    }
});

//运行Gulp时,搭建起跨域服务器
gulp.task('server', function () {
    sh.echo("服务器开启!");
    runSequence(['connect', 'watch'], function () {
        sh.echo('将要打开浏览器访问：http://localhost:9000');
        sh.exec('gulp open-browser');
    });
});

// clean task
gulp.task('clean', function () {
  return del([
      distPath + '/**/*'
  ]);
});

// css task including sass
gulp.task('css', function () {
  gulp.src(srcPath + '/css')
      .pipe(plumber())
      .pipe(cleanCSS({rebase: false}))
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest(distPath + '/css'));
});

// imagemin images and output them in dist
gulp.task('imagemin', function () {
  gulp.src(srcPath + '/images')
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest(distPath + '/images'));
});

// js task
gulp.task('js', function () {
  gulp.src(srcPath + '/js')
      .pipe(plumber())
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(concat('app.bundle.min.js'))
      .pipe(gulp.dest(distPath + '/js'));
});

// prepare Index.html for dist - ie. using min files
gulp.task('index', function () {
  gulp.src(srcPath + '/index.html')
      .pipe(plumber())
      .pipe(htmlreplace({
          'css': 'css/app.min.css',
          'js': 'js/app.bundle.min.js',
      }))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(paths.dist + '/.'));
});

// 构建任务
var production = ['index', 'imagemin', 'css', 'js'];
gulp.task('build',['clean'], function () {
  runSequence(production, function () {
      sh.echo('🚂🚂🚂 即将构建完毕！');
  });
});