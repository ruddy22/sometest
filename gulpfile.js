var gulp = require("gulp"),
    coffee = require("gulp-coffee"),
    stylus = require("gulp-stylus"),
    sourcemaps = require("gulp-sourcemaps"),
    connect = require("gulp-connect"),
    //karma = require("gulp-karma"),
    jade = require("gulp-jade"),
    gutil = require("gulp-util");

//var testFiles = ["app/tests/spec/test.spec.js"];

gulp.task("connect", function () {
  connect.server({root: 'app/build', livereload: true});
});

//gulp.task("test", function () {
//  return gulp.src(testFiles)
//    .pipe(karma({
//      configFile: 'karma.conf.js',
//      action: "run"
//    }))
//    .on("error", gutil.log)
//});

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

gulp.task("stylus", function () {
  gulp
    .src("./app/assets/stylus/styles.styl")
    .pipe(stylus({}))
    .pipe(gulp.dest("./app/build/css/"))
    .pipe(connect.reload())
});

gulp.task("watch", function () {
  gulp.run("jade");
  gulp.run("coffee");
  gulp.run("stylus");
  //gulp.run("test");
  gulp.watch("./app/assets/coffee/*.coffee", ["coffee"]);
  gulp.watch("./app/assets/templates/*.jade", ["jade"]);
  gulp.watch("./app/assets/stylus/*.styl", ["stylus"]);
});

gulp.task("default", ["connect","watch"]);
