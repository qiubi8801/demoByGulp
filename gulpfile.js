// 引入 gulp
var gulp = require('gulp'); 

// 引入组件

var less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require("gulp-jshint"),
    browserSync = require('browser-sync').create(),  //同步浏览
    reload = browserSync.reload;    //实时重载


// 编译Sass
gulp.task('less', function() {
    gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({stream: true}));
});

// 合并，压缩文件
gulp.task('js', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// jsLint检查
gulp.task('jsLint', function() {
    gulp.src('./src/js/kym.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('serve', ['less'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("./src/less/*.less", ['less']);
    gulp.watch("./src/*.html").on('change', reload);
});

// 默认任务
gulp.task('default',['less','jsLint','js']);