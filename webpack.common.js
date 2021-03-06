const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve('src'),
  entry: {
    cheddar: './index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: 'main.js',
    // filename: '[name].bundle.js',
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(gif|svg|jpg|png|wav|mp3)$/,
        // include: SRC,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
