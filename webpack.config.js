const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname);

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/client/client.tsx'
  ],
  output: {
    path: path.resolve(__dirname, 'dist-client'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loaders: ['ts-loader'], include: [path.join(__dirname, 'src/client')] },
      { test: /\.css$/, loader: 'style-loader!css-loader' },

    ],
  }
};