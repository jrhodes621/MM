var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

gulp.task('js', function () {
  gulp.src(['src/**/module.js', 'src/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/app/js/'));
});

gulp.task('default', ['sass', 'sass:watch', 'js']);
