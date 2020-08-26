const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;   // This is useful for explaining large builds, but not needed for most runs
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const config = require('./package.json');

const exportFileName = path.basename(config.main, path.extname(config.main));

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/app/browser.js'),
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: `${exportFileName}.js`,
    libraryTarget: 'umd',
    library: exportFileName,
  },
  externals: {},
  module: {
    // Make sure to load the source maps for any dependent libraries
    rules: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        path.resolve(__dirname, 'src/app/', 'mvtdstpack.wasm')
      ],
    }),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
  devtool: 'source-map',
  node: { // Reduce build size bloat by skipping certain emscripten library shims. TODO: Verify this doesn't break integral.js!
    fs: 'empty',
    path: 'empty',
    crypto: 'empty',
  },
};
