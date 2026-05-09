const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          { loader: 'sass-loader', options: { api: 'modern' } },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })],
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
  },
});
