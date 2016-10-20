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
    'node-uuid': 'node-uuid',
    'lodash.debounce': 'lodash.debounce',
    'react-bootstrap': 'react-bootstrap',
    'transcript-model': 'transcript-model',
  },
};
