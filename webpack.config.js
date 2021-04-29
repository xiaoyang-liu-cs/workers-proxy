const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'webworker',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    library: {
      name: 'rocket-booster',
      type: 'umd',
    },
  },
  resolve: {
    extensions: [
      '.ts',
      '.js',
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
