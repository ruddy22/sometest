var gulp = require("gulp"),
    coffee = require("gulp-coffee"),
    sourcemaps = require("gulp-sourcemaps"),
    connect = require("gulp-connect"),
    jade = require("gulp-jade"),
    gutil = require("gulp-util");

gulp.task("connect", function () {
  connect.server({root: 'app/build', livereload: true});
});

gulp.task("jade", function () {
  gulp
    .src("./app/assets/templates/*.jade")
    .pipe(jade({pretty: true})).on("error", gutil.log)
    .pipe(gulp.dest("./app/build"))
    .pipe(connect.reload())
});

gulp.task("coffee", function () {
  gulp
    .src("./app/assets/coffee/*.coffee")
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true})).on("error", gutil.log)
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./app/build/js"))
    .pipe(connect.reload())
});

gulp.task("watch", function () {
  gulp.run("jade");
  gulp.run("coffee");
  gulp.watch("./app/assets/coffee/*.coffee", ["coffee"]);
  gulp.watch("./app/assets/templates/*.jade", ["jade"]);
});

gulp.task("default", ["connect","watch"]);
