const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const filter = require('gulp-filter');
const eslint = require('gulp-eslint');
const path = require('path');
const isparta = require('isparta');
const uglify = require("gulp-uglify-es").default;
const istanbul = require('gulp-istanbul');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackStream = require('webpack-stream');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;   // This is useful for explaining large builds, but not needed for most runs

const Instrumenter = isparta.Instrumenter;
const mochaGlobals = require('./test/setup/.globals');
const manifest = require('./package.json');

// Gather the library data from `package.json`
const config = manifest.babelBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName = path.basename(mainFile, path.extname(mainFile));

// Lint a set of files
function lint(files) {
  return gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function lintSrc() {
  return lint('src/app/**/*.js');
}

function lintTest() {
  return lint('test/**/*.js');
}

function lintGulpfile() {
  return lint('gulpfile.js');
}

function build() {
  return gulp.src(path.join('src/app', config.entryFileName))
    .pipe(webpackStream({
      mode: 'production',
      output: {
        filename: `${exportFileName}.js`,
        libraryTarget: 'umd',
        library: config.mainVarName
      },
      optimization: {
        minimize: false,
      },
      externals: {},
      module: {
        // Make sure to load the source maps for any dependent libraries
        rules: [
          {
            test: /\.js$/,
            loader: 'source-map-loader',
            enforce: "pre"
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.wasm$/,
            type: 'javascript/auto',
            loader: 'file-loader',
            options: {
              publicPath: 'dist/'
            }
          }
        ]
      },
      plugins: [
        new CleanWebpackPlugin({
          verbose: true,
          cleanOnceBeforeBuildPatterns: [
            'dist/*',
          ]
        }),
        // new BundleAnalyzerPlugin(),
      ],
      devtool: 'source-map',
      node: { // Reduce build size bloat by skipping certain emscripten library shims. TODO: Verify this doesn't break integral.js!
        fs: 'empty',
        path: 'empty',
        crypto: 'empty'
      }
    }))
    .pipe(gulp.dest(destinationFolder))
    .pipe(filter(['**', '!**/*.js.map']))
    .pipe(rename(`${exportFileName}.min.js`))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destinationFolder));
}

function copy_wasm() {
  return gulp
    .src(['src/app/*.wasm'])
    .pipe(gulp.dest('dist/'));
}

function _mocha() {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js', 'test/integration/**/*.js'], { read: false })
    .pipe(mocha({
      globals: Object.keys(mochaGlobals.globals),
      checkLeaks: true
    }));
}

function _registerBabel() {
  require('@babel/register');
}

function test() {
  _registerBabel();
  return _mocha();
}

function coverage(done) {
  _registerBabel();
  gulp.src(['src/app/**/*.js'])
    .pipe(filter(['!**/*cli*js']))
    .pipe(istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      return test()
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
}

const watchFiles = ['src/app/**/*', 'test/**/*', 'package.json', '**/.eslintrc'];

// Run the headless unit tests as you make changes.
function watch() {
  gulp.watch(watchFiles, ['test']);
}

function watchDocs() {
  const files = ['README.md', 'src/app/**/*js', 'test/**/*js', 'src/**/*.md'];
  const exec = require('child_process').exec;
  gulp.watch(files, async function() {
    exec('npm run docs', function(err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
    });
  });
}

exports.lint = gulp.parallel(lintSrc, lintTest, lintGulpfile);
exports.test = gulp.series(exports.lint, test);
exports.coverage = gulp.series(exports.lint, coverage);
exports.build = gulp.series(exports.lint, test, build, copy_wasm);
exports.watch = gulp.series(watch);
exports.watch_docs = gulp.series(watchDocs);
exports.default = gulp.series(exports.test);
