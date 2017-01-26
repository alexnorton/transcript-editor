module.exports = {
  entry: './src/components/TranscriptEditor.js',
  devtool: 'eval',
  output: {
    path: './lib',
    filename: 'bundle.js',
    libraryTarget: 'umd',
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
        loader: 'style-loader!css-loader',
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
};
