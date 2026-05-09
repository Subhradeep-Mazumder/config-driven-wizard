const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { api: 'modern' } },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 4200,
    open: true,
    client: { overlay: { errors: true, warnings: false } },
    proxy: [
      { context: ['/api', '/events'], target: 'http://localhost:4300', changeOrigin: true },
    ],
  },
});
