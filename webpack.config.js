const path = require('path');
const dotenv = require('dotenv');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

dotenv.config();

module.exports = {
  // The entry point file described above
  entry: ['./src/index.js'],
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [miniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  
  mode: process.env.NODE_ENV,
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/key.ico',
    }),
    new miniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ]};