const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const eslint = require("gulp-eslint");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const streamify = require("gulp-streamify");
const terser = require("gulp-terser");

// Paths
const paths = {
    styles: {
        src: "./src/scss/main.scss",
        dest: "./dist/css"
    },
    scripts: {
        src: "./index.js",
        dest: "./dist/js"
    },
    watch: {
        html: "./*.html",
        scripts: "./src/js/**/*.js",
        styles: "./src/scss/**/*.scss"
    }
};

// Compile SCSS to CSS
function styles() {
    const plugins = [autoprefixer(), cssnano()];

    return gulp.src(paths.styles.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(postcss(plugins))
        .pipe(rename({ basename: "funnel-graph", suffix: ".min" }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Bundle JavaScript with Babel
function scripts() {
    return browserify({
        entries: paths.scripts.src,
        standalone: "FunnelGraph"
    })
        .transform(babelify, { global: true, presets: ["@babel/preset-env"] })
        .bundle()
        .pipe(source("funnel-graph.js"))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(streamify(terser()))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Lint JavaScript files
function scriptsLint() {
    return gulp.src(paths.watch.scripts)
        .pipe(eslint())
        .pipe(eslint.format());
}

// Copy SCSS files to dist
function copyScss() {
    return gulp.src("./src/scss/**/*")
        .pipe(gulp.dest("./dist/scss"));
}

// Start the development server
function startServer() {
    browserSync.init({
        startPath: "/examples/example.html",
        server: { baseDir: "./" }
    });
}

// Watch files for changes
function watchFiles() {
    gulp.watch(paths.watch.html).on("change", browserSync.reload);
    gulp.watch(paths.watch.scripts, gulp.series(scriptsLint, scripts));
    gulp.watch(paths.watch.styles, styles);
}

// Define Gulp tasks
const compile = gulp.parallel(styles, scripts, copyScss);
const watch = gulp.series(compile, gulp.parallel(watchFiles, startServer));

// Expose tasks
exports.styles = styles;
exports.scripts = scripts;
exports.scriptsLint = scriptsLint;
exports.watch = watch;
exports.compile = compile;
exports.default = watch;