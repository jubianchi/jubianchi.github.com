var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    util = require('gulp-util'),
    exec = require('gulp-exec'),
    path = require('path');

gulp.task('less', function() {
    gulp.src('_ui/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('styles'))
        .pipe(connect.reload());
});

gulp.task('bootstrap', function() {
    gulp.src('_ui/less/bootstrap/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('styles'))
        .pipe(connect.reload());
});

gulp.task('font-awesome', function() {
    gulp.src('_ui/less/font-awesome/font-awesome.less')
        .pipe(less())
        .pipe(gulp.dest('styles'))
        .pipe(connect.reload());

    gulp.src('_ui/fonts/*')
        .pipe(gulp.dest('fonts'))
        .pipe(connect.reload());
});

gulp.task('web', function() {
    gulp.src('')
        .pipe(exec('_vendor/bin/gumdrop'))
        .pipe(connect.reload());
});

gulp.task('watch', ['server', 'styles'], function() {
    gulp.watch(['_ui/less/**/*.less', '_ui/js/**/*.js', '_ui/fonts/**/*', '_ui/css/**/*.css'], ['styles', 'web']);
    gulp.watch(['*.md', '_layout/**/*', 'boxes/**/*', 'experiments/**/*', 'cv/**/*', 'assets/**/*'], ['web']);
});

gulp.task('server', ['web'], connect.server({
    root: [path.resolve('_site')],
    port: 4001,
    livereload: true
}));

gulp.task('vendor', ['bootstrap', 'font-awesome']);

gulp.task('styles', ['vendor', 'less'], function() {
    gulp.src('_ui/css/**/*.css')
        .pipe(gulp.dest('styles'));
});

gulp.task('default', ['watch']);
