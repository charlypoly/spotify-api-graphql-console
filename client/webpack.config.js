const webpack = require('webpack');
const path = require('path');

console.log(__dirname);

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './client/src/client.tsx'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loaders: ['ts-loader'], include: [path.join(__dirname, 'src/')] },
      { test: /\.css$/, loader: 'style-loader!css-loader' },

    ],
  }
};