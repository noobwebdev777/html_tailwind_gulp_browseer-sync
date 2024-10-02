const gulp = require("gulp");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();

// Process Tailwind CSS
function styles() {
  return gulp
    .src("./src/css/tailwind.css")
    .pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer]))
    .pipe(gulp.dest("./public/css"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
}

// Serve and watch files
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 5173,
    open: false,
    notify: false,
  });

  // Watch HTML files for changes
  gulp.watch("./*.html").on("change", gulp.series(styles, browserSync.reload));

  // Watch JS files for changes
  gulp.watch("./src/js/*.js").on("change", browserSync.reload);

  // Watch Tailwind CSS file for changes
  gulp.watch("./src/css/tailwind.css", styles);

  // Watch all HTML files for Tailwind class changes
  gulp.watch("./**/*.html", styles);
}

// Build task
const build = gulp.parallel(styles);

// Default task
exports.default = gulp.series(build, serve);
