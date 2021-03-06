/* eslint-disable */
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.resolve('./'),
      "node_modules"
    ],
    alias: {
      "c2-redux": path.join(__dirname, '../src')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, '../src')],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
      }
    ]
  },
  plugins: [new ExtractTextPlugin('styles.css')]
}
