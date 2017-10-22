const path = require('path'),
      CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  // 入口文件
  entry: './js/base.js',
  // 输出的目录和文件
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, './dist')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    //  每次构建之前删掉 dist 目录
    new CleanWebpackPlugin(['dist'])
  ]
};
