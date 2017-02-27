/* eslint-disable import/no-extraneous-dependencies */

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    path: './lib',
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'transcript-editor',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['es2015', 'react'],
          plugins: ['add-module-exports'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css'),
      },
    ],
  },
  externals: {
    react: 'react',
    immutable: 'immutable',
    ajv: 'ajv',
    'draft-js': 'draft-js',
    'uuid/v4': 'uuid/v4',
    'lodash.debounce': 'lodash.debounce',
    'transcript-model': 'transcript-model',
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true,
    }),
  ],
};
